import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProfileButton from './ProfileButton'
//import HomePage from '../HomePage'
//import Groups from '../Groups'
// import OpenModalButton from '../OpenModalButton'
// import LoginFormModal from '../LoginFormModal'
//import SignupFormModal from '../SignupFormModal'
import './Navigation.css'

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user)
    // console.log(isLoaded, 'HHHHHHHHHHHHH')
    // const [groups, setGroups] = useState(false)
    // const [signUp, setSignUp] = useState(false)

    // if(groups === true) {
    //      return(
    //         <>
    //          <Groups />
    //         </>
    //     )
    // }

    // if(signUp === true) {
    //     return (
    //         <SignupFormModal />
    //     )
    // }

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
    let createLink;

    if(!sessionUser) {
        createLink = 'noUser'
    } else {
        createLink = 'createGroup'
    }

    return (
        <>
        <ul className='homepageContainer'>
            <div id='get2gether' >
                <NavLink className='homePage' exact to='/'>get2get(hür)</NavLink>
                <span id='git'><a style={{textDecoration: "none", color:'black'}} href="https://github.com/gabriellaguerre" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i>GitHub</a></span>
                <span id='linkedin'><a style={{textDecoration: "none", color:'black'}} href="https://www.linkedin.com/in/gabriel-laguerre/" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin"></i>LinkedIn</a></span>
            </div>
            {isLoaded && (
                <>
                <div id='newGroup'className={createLink}> <NavLink className='startGroup' to='/groups/new'>Start a new group </NavLink></div>
                <div id='profileButton' className='profileButton'>
                    <ProfileButton user={sessionUser} />
                </div>
                </>
            )}
        </ul>
        <div>
            {/* <HomePage user={sessionUser}/> */}
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
