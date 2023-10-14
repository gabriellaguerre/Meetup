import React, { useState, useEffect } from 'react'
import * as sessionActions from '../../store/session'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import './LoginForm.css'

function LoginFormModal() {
    const dispatch = useDispatch()
    const { closeModal } = useModal()



    const [credential1, setCredential1] = useState('')
    const [password1, setPassword1] = useState('')
    const [errors, setErrors] = useState([])
    const [disable, setDisable] = useState(true)



    useEffect(() => {
        if (credential1.length < 4 || password1.length < 6) {
            setDisable(true)
        } else {
            setDisable(false)
        }
    }, [credential1, password1])

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([])
        let credential = credential1
        let password = password1
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json()
                if (data && data.errors) {
                    setErrors(data.errors)
                }
            })
    }


    const demo = (e) => {
        e.preventDefault()
        let credential = "DemoUser"
        let password = 'password'
        dispatch(sessionActions.login({credential, password}))
        .then(closeModal())
    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className='modalBackground'>
                    <div className="modalContainer">
                        <div className='titleCloseButton'>
                            <button onClick={closeModal}>X</button>
                        </div>
                        <div className='title'>Log In</div>
                        <div className='errors'>
                            {errors.credential && (
                                <p>{errors.credential}</p>
                            )}
                        </div>
                        <div className='body'>
                            <label>
                                <input className='input'
                                    placeholder='username or email'
                                    type="text"
                                    value={credential1}
                                    onChange={e => setCredential1(e.target.value)}
                                />

                            </label>
                        </div>

                        <div className='body'>
                            <label>
                                <input className='input'
                                    placeholder='password'
                                    type='password'
                                    value={password1}
                                    onChange={e => setPassword1(e.target.value)}
                                />
                            </label>
                        </div>


                            {disable ? (
                             <div id='logIn'><button id='isDisabled' disabled={disable} >Log In</button></div>
                            ) : (
                              <div id='logInBut'><button id='logInButton' >Log In</button></div>
                            )}
                            <div id='demoButton'><button className='demoButton' onClick={demo}>Demo User</button></div>
                            {/* <button id='cancelButton' onClick={closeModal}>Cancel</button> */}

                    </div>
                </div>

            </form>
        </>
    )
}
export default LoginFormModal;
