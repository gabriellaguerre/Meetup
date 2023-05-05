import React from 'react'
import {NavLink, Route} from 'react-router-dom'
import {useSelector} from 'react-redux'
import './HomePage.css'
import Groups from '../Groups'
import CreateGroup from '../Groups/CreateGroup'

function HomePage() {
    const user = useSelector(state => state.session.user)

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
                <NavLink to='/groups'>See all groups</NavLink>
            </span>
            <span className='bottom'>
              <NavLink to='/events'>Find an event</NavLink>
            </span>
            <span className='bottom'>
            {user ? (
                <NavLink to='/groups/new'>Start a new group</NavLink>
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
