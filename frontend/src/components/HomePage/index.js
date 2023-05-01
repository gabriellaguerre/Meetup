import React from 'react'
import {Link} from 'react-router-dom'
import './HomePage.css'


function HomePage() {
    return (
        <>
        <div>
        <div className='top'>
            The people platform - Where interests become friendships
        </div>
        <span>
            <img src=''/>
        </span>
        <div className='main'>
            How FishNet works
        </div>
        <div>
            <span className='bottom'>
                <Link to='/groups'>See all groups</Link>
            </span>
            <span className='bottom'>Find an event</span>
            <span className='bottom'>Start a new group</span>
        </div>
        <div className='footer'>
            <button>Join get2gether</button>
        </div>
        </div>
        </>
    );
}

export default HomePage;
