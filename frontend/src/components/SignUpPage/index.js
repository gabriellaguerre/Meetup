import React, { useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Redirect} from 'react-router-dom'
import * as sessionActions from '../../store/session'
import './SignUpPage.css'

function SignUpFormPage() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)

    const [userName, setUserName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = ({})

    if (sessionUser) return <Redirect to='/' />

    const onSubmit = (e) => {
        e.preventDefault()

        if(password === confirmPassword) {
            setErrors({})

            const newUser = {
            userName,
            firstName,
            lastName,
            email,
            password
        }
        return dispatch(sessionActions.signUpUser(newUser))

        } else {
            return setErrors({confirmPassword: "Confirm Password field must be the same as the Password field"})
        }


    }

    return (
    <>
        <h1>Sign Up</h1>
        <form onSubmit={onSubmit}>
        {errors.firstName && <p>{errors.firstName}</p>}
        <label>
            First Name:
            <p>
                <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required />
            </p>
        </label>
        <div>
        {errors.lastName && <p>{errors.lastName}</p>}
        <label>
         Last Name:
            <input
                type='text'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required />
        </label>
        </div>
        <div>
        {errors.username && <p>{errors.username}</p>}
        <label>
         User Name:
            <input
                type='text'
                value={userName}
                onChange={e => setUserName(e.target.value)}
                required />
        </label>
        </div>
        <div>
        {errors.email && <p>{errors.email}</p>}
        <label>
         Email:
            <input
                type='text'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required />
        </label>
        </div>
        <div>
        <label>
         Password:
            <input
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>
        <p>
        <button type="submit">Sign Up</button>
        </p>
    </form>
    </>
    );
}

export default SignUpFormPage;
