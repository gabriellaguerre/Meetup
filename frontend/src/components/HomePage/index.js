import React from 'react'
import {NavLink, Route} from 'react-router-dom'
import {useSelector} from 'react-redux'
import './HomePage.css'
import screen from './HomePageImages/homepage1.png'
import Groups from '../Groups'
import CreateGroup from '../Groups/CreateGroup'

function HomePage() {
    const user = useSelector(state => state.session.user)

    return (
         <>
    <div className='homePageBox'>
        <div className='item-a'>
        <div>The people platform - Where interests become friendships</div>
        <div className='ipsum'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
           Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
           and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic
           typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
           Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
        </div>
            <img className='item-aPic' src={screen} alt='screen image' height={250} width={300}/>
        <div className='item-b'>How get2gether works </div>

        <div className='item-c'>
         <NavLink to='/groups'>See all groups</NavLink>
        </div>

        <div className='item-d'>
         <NavLink to='/events'>Find an event</NavLink>
         </div>

            <div className='item-e'>
            {user ? (
                <NavLink to='/groups/new'>Start a new group</NavLink>
            ) : (
                <div>Start a new group</div>
                )}
            </div>

        <div className='item-f'>
            <button>Join get2gether</button>
        </div>
        </div>
        </>
    );
}

export default HomePage;
