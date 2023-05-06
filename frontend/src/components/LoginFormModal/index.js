import React, { useState } from 'react'
import * as sessionActions from '../../store/session'
import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../context/Modal'
import './LoginForm.css'

function LoginFormModal() {
    const dispatch = useDispatch()
    // const sessionUser = useSelector(state => state.session.user)


    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const { closeModal } = useModal()

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([])
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json()
                if (data && data.errors) {
                    setErrors(data.errors)
                }
            })
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

                        <div className='body'>
                            <label>
                                <input className='input'
                                    placeholder='username or email'
                                    type="text"
                                    value={credential}
                                    onChange={e => setCredential(e.target.value)}
                                    />

                            </label>
                        </div>
                        <div className='body'>
                            <label>

                                <input className='input'
                                    placeholder='password'
                                    type='text'
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    />
                            </label>
                            </div>
                            <div className='errors'>
                            {errors.credential && (
                                <p>{errors.credential}</p>
                            )}
                            </div>
                        <div className='footer'>
                            <button type="submit">Log In</button>
                            <button>Demo-User login</button>
                            <button id='cancelButton' onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                    </div>

            </form>
        </>
    )
}
export default LoginFormModal;
