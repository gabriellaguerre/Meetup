import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, useHistory } from 'react-router-dom'
import * as sessionActions from '../../store/session'
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css'



function ProfileButton({ user }) {

  const history = useHistory()
  const dispatch = useDispatch()
  const [showMenu, setShowMenu] = useState(false)
  const ulRef = useRef()

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true)
  }

  useEffect(() => {
    if (!showMenu) return

    const closeMenu = (e) => {
      if (!ulRef.current?.contains(e.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('click', closeMenu)

    return () => document.removeEventListener('click', closeMenu)
  }, [showMenu])

  // const closeMenu = () => setShowMenu(false)

  const logout = (e) => {
    e.preventDefault()
    dispatch(sessionActions.logoutUser())
    .then(history.push('/'))
  }
 const credential = "DemoUser"
 const password = 'password'

 const demo = (e) => {
    e.preventDefault()
    dispatch(sessionActions.login({credential, password}))
  }
  const ulClassName = "profile-dropdown" + (showMenu ? "" : "hidden")
//console.log(ulClassName, "IN PROFILE BUTTON LINE 51")
  return (
    <>
      <button onClick={openMenu}>
        <i className="fa-solid fa-user" />
      </button>
{/* setShowMenu was false, just trying out the true */}
      <div onClick={()=>setShowMenu(false)} className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div id='viewGroups' ><NavLink className='viewGroups' to='/groups' >View Groups</NavLink></div>
            <div id='viewEvents'><NavLink className='viewEvents' to='/events'>View Events</NavLink></div>
            <div id='hello'>Hello, {user.firstName}</div>
            <div id='username'>username:{user.username}</div>
            <div id='name'>name: {user.firstName} {user.lastName}</div>
            <div id='email'>email: {user.email}</div>
            <div className='logoutButton'>
              <button id='logoutButton' onClick={logout}>Log Out</button>
            </div>
          </>
        ) : (
          <>
            <div id='viewGroups'><NavLink className='viewGroups' to='/groups'>View Groups</NavLink></div>
            <div id='viewEvents'><NavLink className='viewEvents' to='/events'>View Events</NavLink></div>

            <div id='loginButton' onClick={()=>setShowMenu(false)}>
              <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
              />
            </div>

            <div id='signinButton' onClick={()=>setShowMenu(false)}>
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
              />
            </div>

            <div id='demoButton'>
              <button className='demoButton' onClick={demo}>Demo User</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default ProfileButton;
