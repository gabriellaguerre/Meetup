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
      <h1>Sign Up</h1>
      <form onSubmit={onSubmit}>
        <label>
          {errors.firstName && <p>{errors.firstName}</p>}
          <div>

            <input
              placeholder='First Name'
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
              <input
                placeholder='Last Name'
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

              <input
                placeholder='Email'
                type='text'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required />
            </div>
          </label>
          <label>
            <div>

              <input
                placeholder='User Name'
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

              <input
                placeholder='Password'
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

              <input
                placeholder='Confirm Password'
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

export default SignupFormModal;
