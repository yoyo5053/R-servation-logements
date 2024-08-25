import React, { useEffect, useState } from 'react'
import {differenceInCalendarDays} from "date-fns"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import axios from 'axios';
const BookingWidget = ({place, onChange, numberOfNights, setNumberOfNights, setAllInfo}) => {
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [numberOfChilds, setNumberOfChilds] = useState(1);
    const [numberOfBaby, setNumberOfBaby] = useState(1);
    const [showGuestInputs, setShowGuestInputs] = useState(false);
    const [disabledDates, setDisabledDates] = useState([]);
    console.log(disabledDates)
    useEffect(() => {
        axios.get(`/booked-dates/${place._id}`).then(({data})=>{
            const bookedDates = getBookedDates(data);
            setDisabledDates(bookedDates);
        })
    
        if (checkIn && checkOut) {
            const nights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
            if (nights > 0) {
                setNumberOfNights(nights);
                setAllInfo({
                    checkIn,
                    checkOut,
                    totalOfGuests: numberOfBaby + numberOfChilds + numberOfGuests,
                });
            }
        }
      }, [checkIn, checkOut, numberOfBaby, numberOfChilds, numberOfGuests]);
      
      const getBookedDates = (reservations) => {
        let bookedDates = [];
        reservations.forEach(reservation => {
          let currentDate = new Date(reservation.checkIn);
          const checkOutDate = new Date(reservation.checkOut);
    
          while (currentDate <= checkOutDate) {
            bookedDates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });
        return bookedDates;
      };

    const handleIncrement = (e) => {
        switch(e.target.id) {
            case 'guests':
              setNumberOfGuests(numberOfGuests + 1)
              break;
            case 'child':
              setNumberOfChilds(numberOfChilds + 1)
              break;
            case 'baby':
              setNumberOfBaby(numberOfBaby + 1);
              break;
            default:
        }
    };
  
    const handleDecrement = (e) => {
        switch(e.target.id) {
            case 'guests1':
              setNumberOfGuests(numberOfGuests - 1)
              break;
            case 'child1':
              setNumberOfChilds(numberOfChilds - 1)
              break;
            case 'baby1':
              setNumberOfBaby(numberOfBaby - 1);
              break;
            default:
        }
    };

    const toggleGuestInputs = () => {
        setShowGuestInputs(!showGuestInputs);
      };
      const handleCheckInChange = (date) => {
        setCheckIn(date);
    };

    const handleCheckOutChange = (date) => {
        setCheckOut(date);
    };

    const handleMaxDate = () => {
        const sortedDisabledDates = disabledDates.sort((a, b) => new Date(a) - new Date(b));
        const maxPossibleDate = sortedDisabledDates.find((date)=>{
           return new Date(date) > new Date(checkIn)
        })
        if(maxPossibleDate){
            const maxAvailabaleDate = new Date(maxPossibleDate);
            maxAvailabaleDate.setDate(maxAvailabaleDate.getDate()-1);
            return maxAvailabaleDate
        }

        return undefined
    };
    
    return ( 
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: ${place.price} / per night
            </div> 
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className="py-3 px-4 border-l">
                        <label>Check-in:</label>
                        <DatePicker
                            selected={checkIn}
                            onChange={handleCheckInChange}
                            minDate={new Date()}
                            maxDate={checkOut || undefined}
                            format="yyyy-MM-dd"
                            excludeDates={disabledDates}
                        />
                    </div>
                    <div className="py-3 px-4 border-l">
                        <label>Check-Out:</label>
                        <DatePicker
                            selected={checkOut}
                            onChange={handleCheckOutChange}
                            minDate={checkIn || new Date()}
                            maxDate={checkIn && handleMaxDate()}
                            format="yyyy-MM-dd"
                            excludeDates={disabledDates}
                        /> 
                    </div>
                </div>
                <div className="flex border-y"></div>
                <div className="flex flex-col border-y">
      <div
        className="flex px-2 py-2 items-center justify-between cursor-pointer"
        onClick={toggleGuestInputs}
      >
        <div className="flex px-2 py-2 items-center justify-between">
            <div className="flex text-lg font-medium">Guests</div>
            {showGuestInputs ? <div className="flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-60">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
            </div> :
            <div className="flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-60">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </div>}
        </div>

      </div>
      {showGuestInputs && (
        <>
          <div className="flex px-2 py-2 items-center justify-between">
                        <div className="flex">Adultes</div>
                        <div className="flex gap-3">
                            <button
                            id="guests1"  
                            disabled={numberOfGuests==1} 
                            onClick={e=>handleDecrement(e)}
                            className="px-3 py-2 ml-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
                            >
                                -
                            </button>
                            <div className="py-2" >
                                {numberOfGuests}
                            </div>
                            <button
                            id="guests" 
                            disabled={numberOfGuests==place.maxGuests} 
                            onClick={e=>handleIncrement(e)}
                            className="px-3 py-2 mr-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
                            >
                                +
                            </button>
    
                        </div>
                    </div>
                    <div className="flex px-2 py-2 items-center justify-between">
                        <div className="flex">Enfants</div>
                        <div className="flex gap-3">
                            <button
                            id="child1"  
                            disabled={numberOfChilds==0} 
                            onClick={e=>handleDecrement(e)}
                            className="px-3 py-2 ml-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
                            >
                                -
                            </button>
                            <div className="py-2">
                                {numberOfChilds}
                            </div>
                            <button
                            id="child" 
                            disabled={numberOfChilds==place.maxChilds} 
                            onClick={e=>handleIncrement(e)}
                            className="px-3 py-2 mr-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="flex px-2 py-2 items-center justify-between">
                        <div className="flex">Bébés</div>
                        <div className="flex gap-3">
                            <button
                                id="baby1"
                                disabled={numberOfBaby === 0}
                                onClick={(e) => handleDecrement(e)}
                                className="px-3 py-2 ml-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
                            >
                                -
                            </button>
                            <div className="py-2">
                                {numberOfBaby}
                            </div>
                            <button
                                id="baby"
                                disabled={numberOfBaby === place.maxBaby}
                                onClick={(e) => handleIncrement(e)}
                                className="px-3 py-2 mr-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
                            >
                                +
                            </button>
                        </div>
                                    </div>
                        </>
                    )}
                    </div>    
                <button  disabled={!checkIn || !checkOut } onClick={()=>{onChange(true)}} className="primary">
                    Book this place 
                </button>
            </div> 
        </div>
     );
}

export default BookingWidget