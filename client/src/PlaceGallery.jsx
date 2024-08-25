import React, { useState } from 'react'

const PlaceGallery = ({place}) => {
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    if(showAllPhotos){
        return(
                <div className="absolute inset-0 bg-black text-white min-h-screen">
                    <div className="bg-black p-8 grid gap-4">
                        <div>
                            <h2 className="text-3xl">Photos of {place.title}</h2>
                            <button onClick={()=>setShowAllPhotos(false)} className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                                Close Photos
                            </button>
                        </div>
                        {place.photos.map(photo => (
                            <div key={photo}>
                                <img src={'http://localhost:4000/uploads/'+photo} alt="" />
                            </div>
                        ))}
                    </div>
                </div>
        )
    }
  return (
    <div className="relative">
                    <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
                        <div>
                            <img onClick={()=>{setShowAllPhotos(true)}} className="aspect-square cursor-pointer rounded-l-xl object-cover" src={"http://localhost:4000/uploads/"+place.photos[0]} alt="" />
                        </div>
                        <div className="grid">
                            <img onClick={()=>{setShowAllPhotos(true)}} className="aspect-square cursor-pointer rounded-r-xl object-cover" src={"http://localhost:4000/uploads/"+place.photos[1]} alt="" />
                            <div className="overflow-hidden">
                            <img onClick={()=>{setShowAllPhotos(true)}} className="aspect-square cursor-pointer object-cover rounded-r-xl relative top-2" src={"http://localhost:4000/uploads/"+place.photos[2]} alt="" />
                        </div>
                        </div>
                    </div>
                    <button onClick={()=>{setShowAllPhotos(true)}} className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-md shadow-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        Show more photos
                    </button>
                </div>
  )
}

export default PlaceGallery