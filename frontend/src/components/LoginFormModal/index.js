import React, { useState, useEffect } from 'react'
import * as sessionActions from '../../store/session'
import { useDispatch, useSelector,  } from 'react-redux'
import { useModal } from '../../context/Modal'
import './LoginForm.css'

function LoginFormModal() {
    const dispatch = useDispatch()
    // const sessionUser = useSelector(state => state.session.user)


    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const [disable, setDisable] = useState(true)
    const { closeModal } = useModal()

    
    useEffect(() => {
        if(credential.length < 4 || password.length < 6) {
            setDisable(true)
        } else {
            setDisable(false)
        }
    }, [credential, password])

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
                            {disable ? (
                            <button id='isDisabled' disabled={disable} >Log In</button>
                            ) : (
                                <button disabled={disable} >Log In</button>
                            )}
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
