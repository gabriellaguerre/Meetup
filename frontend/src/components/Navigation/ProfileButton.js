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

//  console.log(user, showMenu, 'UUUUUUUUUUUUUU')

  // const openMenu = () => {
  //   console.log(showMenu, 'showMenu')
  //   if (showMenu) setShowMenu(false);
  //   setShowMenu(true)
  // }

  useEffect(() => {
     if (!showMenu) return

    const closeMenu = (e) => {
      if (!ulRef.current?.contains(e.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('click', closeMenu)
    console.log(showMenu, 'USE EFFECT SHOWMENU')
    return () => document.removeEventListener('click', closeMenu)

  }, [showMenu])

  // const closeMenu = () => setShowMenu(false)

  const logout = (e) => {
    e.preventDefault()
    dispatch(sessionActions.logoutUser())
    .then(history.push('/'))
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : "hidden")
  // console.log(ulClassName, 'UL Classname') onClick={openMenu}

  return (
    <>
      <button id='navicon' onClick={()=>setShowMenu(!showMenu)}>
        <i className="fa-solid fa-user" />
      </button>

      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div id='viewGroups' ><NavLink onClick={()=>setShowMenu(false)} className='viewGroups' to='/groups' >View Groups</NavLink></div>
            <div id='viewEvents'><NavLink onClick={()=>setShowMenu(false)} className='viewEvents' to='/events'>View Events</NavLink></div>
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
            <div id='viewGroups'><NavLink onClick={()=>setShowMenu(false)} className='viewGroups' to='/groups'>View Groups</NavLink></div>
            <div id='viewEvents'><NavLink onClick={()=>setShowMenu(false)} className='viewEvents' to='/events'>View Events</NavLink></div>

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
          </>
        )}
      </div>
    </>
  );
}
export default ProfileButton;
