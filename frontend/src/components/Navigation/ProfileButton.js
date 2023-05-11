import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Link, Route, NavLink } from 'react-router-dom'
import * as sessionActions from '../../store/session'
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';



function ProfileButton({ user }) {

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
      if (!ulRef.current.contains(e.target)) {
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
  }
 const credential = "DemoUser"
 const password = 'abc'

 const demo = (e) => {
    e.preventDefault()
    dispatch(sessionActions.login({credential, password}))
  }
  const ulClassName = "profile-dropdown" + (showMenu ? "" : "hidden")

  return (
    <>
      <button onClick={openMenu}>
        <i className="fa-solid fa-user" />

      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <ul><Link to='/groups'>View Groups</Link></ul>
            <p></p>
            <ul><Link to='/events'>View Events</Link></ul>
            <p></p>
            <ul>Hello, {user.firstName}</ul>
            <p></p>
            <ul>username:{user.username}</ul>
            <ul>name: {user.firstName} {user.lastName}</ul>
            <ul>email: {user.email}</ul>
            <ul>
              <button onClick={logout}>Log Out</button>
            </ul>
          </>
        ) : (
          <>
            <ul><Link to='/groups'>View Groups</Link></ul>
            <p></p>
            <ul><Link to='/events'>View Events</Link></ul>
            <p></p>
            <ul>
              <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
              />
            </ul>
            <ul>
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
              />
            </ul>
            <ul>
              <button onClick={demo}>Demo User</button>
            </ul>
          </>
        )}
      </ul>
    </>
  );
}
export default ProfileButton;
