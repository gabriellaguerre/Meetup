import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import * as sessionActions from '../../store/session'
import './SignUpPage.css'

function SignupFormModal() {
  const dispatch = useDispatch()
  //const sessionUser = useSelector(state => state.session.user)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const {closeModal} = useModal()

 // if (sessionUser) return <Redirect to='/' />

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
      ).then(closeModal)
        .catch(async (res) => {
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
   <form onSubmit={onSubmit}>
      <div className='modalBackground1'>
         <div className="modalContainer1">

      <div className='titleCloseButton1'>
          <button onClick={closeModal}>X</button>
        </div>

      <div className="title1">Sign Up</div>

        <label>
          <div className='errors'>
          {errors.firstName && <p>{errors.firstName}</p>}
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
          <div>
          {errors.lastName && <p>{errors.lastName}</p>}
          </div>
              <input
                placeholder='Last Name'
                type='text'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                />
            </div>
          </label>

        <label>
        <div className='errors'>
          {errors.username && <p>{errors.username}</p>}
        </div>
        <div className='errors'>
          {errors.email && <p>{errors.email}</p>}
          </div>

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

          <div className='body1'>
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          </div>

        <div className='footer1'>
          <button type="submit">Sign Up</button>
          <button id='cancelButton1' onClick={closeModal}>Cancel</button>
        </div>
        </div>
        </div>
      </form>
    </>
  );
}

export default SignupFormModal;
