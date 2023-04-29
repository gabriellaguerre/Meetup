import React from 'react'
import {useDispatch} from 'react-redux'
import * as sessionActions from '../../store/session'


function ProfileButton({user}) {

    const dispatch = useDispatch()

    const logout = (e) => {
        e.preventDefault()
        dispatch(sessionActions.logoutUser())
    }

    const ulClassName = "profile-dropdown";

    return (
        <>
        <button>
        <i className="fa-solid fa-user" style={{color: "#cfcfcf",}} />
        </button>
        <ul>
        <li>{user.username}</li>
        <li>{user.firstName} {user.lastName}</li>
        <li>{user.email}</li>
        <li>
            <button onClick={logout}>Log Out</button>
        </li>
        </ul>
        </>

 )

}
export default ProfileButton;
