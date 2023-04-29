import React, { useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Redirect} from 'react-router-dom'
import * as sessionActions from '../../store/session'
import './SignUpPage.css'

function SignUpPage() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    console.log(sessionUser, 'IN SIGN UP page')

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})

 //   if (sessionUser !== null) return <Redirect to='/' />

    const onSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
          setErrors({});
          return dispatch(
            sessionActions.signUpUser({
              email,
              username,
              firstName,
              lastName,
              password,
            })
          ).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
              setErrors(data.errors);
            }
          });
        }
        return setErrors({
          confirmPassword: "Confirm Password field must be the same as the Password field"
        });
      };


    return (
    <>
        <h1>Sign Up</h1>
        <form onSubmit={onSubmit}
              className='formbody'>

        <label>
        {errors.firstName && <p>{errors.firstName}</p>}
            <div>
            First Name:
                <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required />
                </div>
        </label>

        <div>
        {errors.lastName && <p>{errors.lastName}</p>}
        <label>
            <div>
         Last Name:
            <input
                type='text'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required />
                </div>
        </label>
        </div>
        <div>
        {errors.username && <p>{errors.username}</p>}
        </div>
        <div>
        {errors.email && <p>{errors.email}</p>}
        <label>
            <div>
         Email:
            <input
                type='text'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required />
            </div>
        </label>
        <label>
            <div>
         User Name:
            <input
                type='text'
                value={username}
                onChange={e => setUserName(e.target.value)}
                required />
                </div>
        </label>
        </div>
        <div>
        <label>
            <div>
         Password:
            <input
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required />
                </div>
        </label>
        </div>
        <div>
        <label>
            <div>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          </div>
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>
        <div>
        <button type="submit">Sign Up</button>
        </div>
    </form>
    </>
    );
}

export default SignUpPage;
