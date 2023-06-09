import React, { useState} from 'react'
import { useDispatch } from 'react-redux'
//import {useHistory} from 'react-router-dom'
import { useModal } from '../../context/Modal'
import * as sessionActions from '../../store/session'
import './SignUpPage.css'

function SignupFormModal() {
  const dispatch = useDispatch()
  //const history = useHistory()


  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})

  const {closeModal} = useModal()


  const onSubmit = (e) => {
    e.preventDefault();


    if (password === confirmPassword) {
      setErrors({});

      dispatch(sessionActions.signUpUser({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
      // const credential = email;
      // return (dispatch(sessionActions.login({credential, password})))
      .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();

          if (data && data.errors) {
      console.log(data.errors)
            setErrors(data.errors);
          }
        });
    } else {
      setErrors({})
    }


   };


  return (
    <>
   <form onSubmit={onSubmit}>
      <div id='modal-background'>
         <div className="modalContainer2">

      <div className='titleCloseButton2'>
          <button id='titleCloseButton2' onClick={closeModal}>X</button>
        </div>

      <div className="title1">Sign Up</div>
      {(firstName.length === 0 || lastName.length === 0 || email.length === 0 || username.length === 0 || password.length === 0) ? (
          <div id='allFields'>*All Fields Must Be Filled Out</div>
        ) : (<div></div>)}

      <div id='firstname'>First Name:</div>
      <div className='bodyFName'>
            <input
              placeholder='First Name'
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              />
          </div>
          <div className='errorFName'>
          {errors.firstName && <div>{errors.firstName}</div>}
          </div>


        <div id='bodyLName'>Last Name:</div>
          <div className='bodyLName'>
              <input
                placeholder='Last Name'
                type='text'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                // onClick={()=> setHasFilled(true)}
                />
            </div>
            <div className='errorLName'>
            {errors.lastName && <div>{errors.lastName}</div>}</div>



            <div id='bodyEmail'>Email:</div>
            <div className='bodyEmail'>
              <input
                placeholder='Email'
                type='text'
                value={email}
                onChange={e => setEmail(e.target.value)}
                // onClick={()=> setHasFilled(true)}
                />
            </div>
            <div className='errorEmail'>
          {errors.email && <div>{errors.email}</div>}
          </div>



          <div id='bodyUsername'>Username:</div>
           <div className='bodyUsername'> <input
                placeholder='User Name'
                type='text'
                value={username}
                onChange={e => setUserName(e.target.value)}
                // onClick={()=> setHasFilled(true)}
                />
                </div>
         <div className='errorUsername'>
         {errors.username && <div>{errors.username}</div>}
          {/* {(username.includes('@') || username.includes('.com')) ? (
            <div>*Username cannot be an email</div>
          ): (
             <div>{errors.username && <div>{errors.username}</div>}</div>
          )} */}
        </div>




        <div id='bodyPassword'>Password:</div>
         <div className='bodyPassword'><input
                placeholder='Password'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                // onClick={()=> setHasFilled(true)}
                />
            </div>
          <div className='errorPassword'>
          {errors.password && <div>{errors.password}</div>}
        </div>



         <div id='bodyConfirm'>Confirm Password:</div>
          <div className='bodyConfirm'> <input
                placeholder='Confirm Password'
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                // onClick={()=> setHasFilled(true)}
              />
            </div>
          <div className='errorConfirm'>
          {(password !== confirmPassword) ? (
            <div>*Confirm password does not match password</div>
          ) : (
            <div></div>
          )}
          {/* {errors && <div>{errors}</div>} */}
          </div>



        <div className='footer1'>
        {(firstName.length === 0 || lastName.length === 0 || email.length === 0 || username.length < 4 || password.length === 0 || password !== confirmPassword) ? (
          <button id='isDisabled2' disabled={true}>Sign Up</button>
          ) : (
            <button disabled={false}>Sign Up</button>
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
