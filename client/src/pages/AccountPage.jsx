import React, { useContext, useState } from 'react'
import { UserContext } from '../userContext'
import { Link, Navigate, useParams } from 'react-router-dom';
import PlacesPage from './PlacesPage';
import axios from 'axios';
import AccountNav from '../AccountNav';
import BookingPage from './BookingPage';

const AccountPage = () => {
    const {user, ready, setUser} = useContext(UserContext);
    const [redirect, setRedirect] = useState(null);
    let {subpage} = useParams();
    
    if(subpage === undefined){
        subpage = 'profile';
    }
    if(!ready){
        return 'Loading...'
    }

    if(ready && !user && !redirect){
        return <Navigate to={'/login'} />
    }

    if(redirect){
        return <Navigate to={redirect}/>
    }

    async function Logout(){
        await axios.post('/logout');
        setUser(null);
        setRedirect('/');
    }

    return(
        <div>
           <AccountNav/>
             {subpage === 'profile' &&(
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name}  ({user.email}) <br/>
                    <button onClick={Logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
             )}
             {subpage === 'bookings' && (
                <BookingPage/>
             )}
             {subpage === 'places' && (
                <PlacesPage/>
             )}
        </div>
    );
}

export default AccountPage