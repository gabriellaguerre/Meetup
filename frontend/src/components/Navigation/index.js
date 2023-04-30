import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProfileButton from './ProfileButton'
import HomePage from '../HomePage'
// import OpenModalButton from '../OpenModalButton'
// import LoginFormModal from '../LoginFormModal'
// import SignupFormModal from '../SignupFormModal'
import './Navigation.css'

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user)

    // let sessionLinks;

    // if (sessionUser === null) {
    //     sessionLinks = (
    //         <li>
    //             <OpenModalButton
    //                 buttonText="Log In"
    //                 modalComponent={<LoginFormModal />}
    //             />
    //             <OpenModalButton
    //                 buttonText='Sign Up'
    //                 modalComponent={<SignupFormModal />}
    //             />

    //         </li>
    //     );

    // } else {
    //     sessionLinks = (
    //         <li>
    //             <ProfileButton user={sessionUser} />
    //         </li>
    //     );
    // }

    return (
        <>
        <ul id='homepageContainer'>
            <div className='homePage'>
                <NavLink exact to='/'>FishNet</NavLink>
            </div>
            {isLoaded && (
                <div className='profileButton'>
                    <ProfileButton user={sessionUser} />
                </div>
            )}
        </ul>
        <div>
            <HomePage />
        </div>
        </>
    )
}

export default Navigation;
