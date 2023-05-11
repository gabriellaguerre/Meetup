import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {useHistory} from 'react-router-dom'
import { useModal } from '../../context/Modal'
import * as sessionActions from '../../store/session'
import './SignUpPage.css'

function SignupFormModal() {
  const dispatch = useDispatch()
  const history = useHistory()


  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState([])
  const [disable, setDisabled] = useState(true)
  const {closeModal} = useModal()

 useEffect(()=> {

  if(firstName.length === 0 || lastName.length === 0 || email.length === 0 || username.length < 4 || password.length < 6 ) {
      setDisabled(true)
  } else {
    setDisabled(false)
  }
  
 },[firstName, lastName, email, username, password, errors])

  const onSubmit = (e) => {
    e.preventDefault();

    if(firstName.length === 0) {
      errors = 'First Name is required'
    }

    if (password === confirmPassword) {
      setErrors([]);
      dispatch(sessionActions.signUpUser({
          email,
          username,
          firstName,
          lastName,
          password,
        })

      )
      const credential = email;
      return dispatch(sessionActions.login({credential, password}))
      .then(closeModal)
       .then(history.push('/'))
        .catch(async (res) => {
          const data = await res.json();

          if (data && data.errors.credential) {
            setErrors(data.errors.credential);
          }
        });
    } else {
      setErrors("Confirm Password field must be the same as the Password field")
    }

  };


  return (
    <>
   <form onSubmit={onSubmit}>
      <div className='modalBackground1'>
         <div className="modalContainer1">

      <div className='titleCloseButton1'>
          <button onClick={closeModal}>X</button>
        </div>

      <div className="title1">Sign Up</div>

        <label>
          <div className='errors'>
          {errors && <p>{errors}</p>}
          </div>
          <div className='body1'>
            <input
              placeholder='First Name'
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              />
          </div>
        </label>

        <label>
        <div className='body1'>
          {/* <div>
          {errors.lastName && <p>{errors.lastName}</p>}
          </div> */}
              <input
                placeholder='Last Name'
                type='text'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                />
            </div>
          </label>

        <label>
        {/* <div className='errors'>
          {errors.username && <p>{errors.username}</p>}
        </div> */}
        {/* <div className='errors'>
          {errors.email && <p>{errors.email}</p>}
          </div> */}

            <div className='body1'>
              <input
                placeholder='Email'
                type='text'
                value={email}
                onChange={e => setEmail(e.target.value)}
                />
            </div>
          </label>

          <label>
          <div className='body1'>
              <input
                placeholder='User Name'
                type='text'
                value={username}
                onChange={e => setUserName(e.target.value)}
                />
                </div>
                </label>


        <label>
        <div className='body1'>
              <input
                placeholder='Password'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                />
            </div>
          </label>

          <label>
         <div className='body1'>
              <input
                placeholder='Confirm Password'
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </label>

          {/* <div className='body1'>
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          </div> */}

        <div className='footer1'>
        {disable ? (
          <button id='isDisabled2' disabled={disable}>Sign Up</button>
          ) : (
            <button disabled={disable}>Sign Up</button>
            )}
          <button id='cancelButton1' onClick={closeModal}>Cancel</button>
        </div>
        </div>
        </div>
      </form>
    </>
  );
}

export default SignupFormModal;
