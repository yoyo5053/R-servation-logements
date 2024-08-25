import React, { useState, useEffect } from 'react'
import PhotosUploader from '../PhotosUploader'
import Perks from '../Perks'
import { useForm, FormProvider } from 'react-hook-form';
import axios from 'axios';
import AccountNav from '../AccountNav';
import { Navigate } from 'react-router-dom';import {useParams} from 'react-router-dom';


const PlacesUpdatePage = () => {
    const { register, handleSubmit, setValue } = useForm();
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [deletedPhotos, setDeletedPhotos] = useState(null);
    const [redirect, setRedirect]=useState(false);
    const [place, setPlace] = useState(null);
    const {id} = useParams();
    useEffect(()=>{
        axios.get(`/place/${id}`).then(({data})=>{
          setPlace(data)
          setAddedPhotos(data.photos)
        });
    },[id])
    const onSubmit = async (data) => {
        if (deletedPhotos){
            await axios.post('/deletePhotos', {deletedPhotos})
            .then(response => {
                console.log("ok")
            });
        }
        await axios.put(`/place/${id}`, { ...data, photos: addedPhotos });
        setRedirect(true);
    };    
    function inputHeader(text){
        return(
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function inputDescription(text){
        return(
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }
    function preInput(header, description){
        return(
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }
    if(redirect){
        return <Navigate to={'/account/places'}/>
    }

    if (!place) {
        return <div>Loading...</div>;
    }

    return (
    <>
        <div>
            <AccountNav/>
            {place &&
            <form onSubmit={handleSubmit(onSubmit)}>
                {preInput('Title', 'title for your place. should be short and catchy')}
                <input defaultValue={place.title} type="text"  placeholder="title, for example: My lovely apt" {...register('title')} />
                {preInput('Address', 'Address to this place')}
                <input defaultValue={place.address} type="text" placeholder="address"  {...register('address')}/>
                {preInput('Photos', 'more = better')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} onChange2={setDeletedPhotos}/>
                {preInput('Description', 'description of the place')}
                <textarea defaultValue={place.description} {...register('description')}/>
                {preInput('Perks', 'select all the perks of your place')}
                <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-2">
                    <Perks register={register} place={place} setValue={setValue}/>
                </div>
                {preInput('Extra info', 'house rules, etc')}
                <textarea defaultValue={place.extraInfo} {...register('extraInfo')}/>
                {preInput('Check In&Out times', 'add check in and out times, remember to have some time window for cleaning the room between guests')}
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in time</h3>
                        <input defaultValue={place.checkIn} type="text" {...register('checkIn')}/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check out time</h3>
                        <input defaultValue={place.checkOut} type="text" {...register('checkOut')}/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input defaultValue={place.price} type="text" {...register('price')}/>
                    </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-3">
                <div>
                    <h3 className="mt-2 -mb-1">Max number of guests</h3>
                    <input defaultValue={place.maxGuests} type="text" {...register('maxGuests')}/>
                </div>
                <div>
                    <h3 className="mt-2 -mb-1">Max number of childs</h3>
                    <input defaultValue={place.maxChilds} type="text" {...register('maxChilds')}/>
                </div>
                <div>
                    <h3 className="mt-2 -mb-1">Max number of baby</h3>
                    <input defaultValue={place.maxBaby} type="text" {...register('maxBaby')}/>
                </div>
                </div>
                <button className="primary my-4">Update</button>
            </form>
            }
        </div>
        
    </>
  )
}

export default PlacesUpdatePage