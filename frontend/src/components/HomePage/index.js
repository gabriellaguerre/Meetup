import React from 'react'
import {Link, Route} from 'react-router-dom'

import './HomePage.css'
import Groups from '../Groups'

function HomePage({ user }) {
console.log(user, "IN HOME PAGE")
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
            How get2gether works
        </div>
        <div>
            <span className='bottom'>
                <Link to='/groups'>See all groups</Link>
            </span>
            <span className='bottom'>
              <Link to='/events'>Find an event</Link>
            </span>
            <span className='bottom'>
            {user ? (
                <Link to='/groups/new'>Start a new group</Link>
            ) : (
                <span>Start a new group</span>
                )}
            </span>
        </div>
        <div className='footer'>
            <button>Join get2gether</button>
        </div>
        </div>
        </>
    );
}

export default HomePage;
