import React, {useState} from 'react'
import { NavLink, Route, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProfileButton from './ProfileButton'
import HomePage from '../HomePage'
import Groups from '../Groups'
// import OpenModalButton from '../OpenModalButton'
// import LoginFormModal from '../LoginFormModal'

import SignupFormModal from '../SignupFormModal'
import './Navigation.css'

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user)

    const [groups, setGroups] = useState(false)
    const [signUp, setSignUp] = useState(false)

    if(groups === true) {
         return(
            <>
             <Groups />
            </>
        )
    }

    if(signUp === true) {
        return (
            <SignupFormModal />
        )
    }

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
                <NavLink exact to='/'>get2gether</NavLink>
            </div>
            {isLoaded && (
                <div className='profileButton'>
                    <ProfileButton user={sessionUser} />
                </div>
            )}
        </ul>
        <div>
            <HomePage user={sessionUser}/>
        </div>

        {/* <div>
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
                <button onClick={() => setGroups(true)}>
                <Link to='/groups'>
                    See all groups</Link></button>
            </span>
            <span className='bottom'>Find an event</span>
            <span className='bottom'>Start a new group</span>
        </div>
        <div className='footer'>
            <button onClick={() => setSignUp(true)}>Join get2gether</button>
        </div>
        </div> */}
        </>


    )
}

export default Navigation;
