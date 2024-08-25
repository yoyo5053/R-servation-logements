import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
function IndexPage() {
  const [places, setPlaces] = useState([]);
  useEffect(()=>{
    axios.get('/places').then(({data})=>{
        setPlaces(data);
    },[])
  },)
  return (
  <div className="mt-8 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {places.length > 0 && places.map((place,i) => (
        <Link to={'/place/'+place._id} key={i}>
            <div className="bg-gray-500 rounded-2xl flex"> 
                <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4000/uploads/'+place.photos?.[0]} alt="" />
            </div>                                                             
            <div>
                <h2 className="text-bold">{place.address}</h2>
                <h3 className="font-sm text-gray-500"> {place.title}</h3>
                <div className="mt-1">
                   <span className="font-bold"> ${place.price} </span>per night
                </div>
            </div>
        </Link>
    ))}
  </div>  
  )
}

export default IndexPage