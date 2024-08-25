import React, { useContext, useState } from 'react';
import { UserContext } from './userContext'
import LoginPage from './pages/LoginPage';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const AccommodationBooking = ({place, numberOfNights, allInfo, setShowNextStep}) => {
  const {user} = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  
  const { register, handleSubmit, setValue } = useForm();
  let fee = (place.price * numberOfNights)* 0.05;
  let taxes = (place.price * numberOfNights)* 0.02;
  let total = fee + taxes + (place.price * numberOfNights);
  
  const formatDate = (date) => format(new Date(date), 'dd');
  const formatMonth = (date) => format(new Date(date), 'MMMM');
  const checkInOut = `${formatDate(allInfo.checkIn)}–${formatDate(allInfo.checkOut)} ${formatMonth(allInfo.checkIn)}`;

  const onSubmit = async (data) => {
    axios.post('/booking', {...data, allInfo, place: place._id, 'price': total})
    .then((res)=>{
      const bookingId = res.data._id;
      setRedirect(`/account/bookings/${bookingId}`)
    })
  };  

  if(redirect){
    return <Navigate to={redirect} />
  }
  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
        <h1
          className="flex items-center gap-1 p-2 absolute cursor-pointer text-3xl font-semibold mb-6 hover:text-gray-500"
          onClick={() => setShowNextStep(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
            stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          <span>Edit</span>
        </h1>
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-gray-50">
            <h2 className="flex text-3xl font-semibold mb-6">
              Confirm and pay
            </h2>
            <p className="text-gray-600 mb-4">Guests: {allInfo.totalOfGuests} guests</p>
            <p className="text-gray-600 mb-4">Dates: {checkInOut}</p>
            {user ? <form className="max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)} >
              <div className="py-3 px-4 border-t">
                <label>Your full name:</label>
                <input defaultValue={user.name} type="text" {...register('name')}/>
                <label>Phone number:</label>
                <input type="tel" {...register('phone')}/>
              </div>
              <button className="primary">Confirm your booking</button>
            </form> : <LoginPage/> }
            
          </div>

          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-gray-200">
            <img
              src={"http://localhost:4000/uploads/"+place.photos[0]}
              alt="Accommodation"
              className="w-64 h-64 rounded-lg mb-8"
            />
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">
                {place.title}
              </h3>
              <p className="text-xl font-bold text-gray-600 mb-2">Price details</p>
              <div className="mt-4">
                <p className="text-gray-600 mb-2">{place.price}.00 EUR x {numberOfNights} nights</p>
                <p className="text-gray-600 mb-2">Airbnb Service Fee {fee.toFixed(2)} EUR</p>
                <p className="text-gray-600 mb-2">Taxes {taxes.toFixed(2)} EUR</p>
                <p className="text-gray-600 font-semibold">Total (EUR) {total.toFixed(2)} EUR</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationBooking;
