import React, { useState } from 'react'
import * as sessionActions from '../../store/session'
import {useDispatch, useSelector} from 'react-redux'
import {Redirect} from 'react-router-dom'
import './LoginForm.css'

function LoginFormPage() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)

    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])



    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([])
        dispatch(sessionActions.login({credential, password}))
    }

    if(sessionUser) {
        return <Redirect to='/' />
        }
    return (
        <form onSubmit={handleSubmit}>
            <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <label>
                credential(unsername or email):
                <p>
                    <input className='input'
                    type="text"
                    value={credential}
                    onChange={e => setCredential(e.target.value)}
                    required />
                </p>
            </label>
            <div>
            <label>
             password:
                <input className='input'
                    type='text'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required />
            </label>
            </div>
            <p>
            <button type="submit">Log In</button>
            </p>
        </form>
    )
}
export default LoginFormPage;
