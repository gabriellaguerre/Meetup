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
    const {closeModal} = useModal()

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([])
        return dispatch(sessionActions.login({ credential, password }))
        .then(closeModal)
        .catch(async (res) => {
            const data = await res.json()
            if(data && data.errors) {
                setErrors(data.errors)
            }
        })
    }

    // if (sessionUser) {
    //     return <Redirect to='/' />
    // }


    return (
        <>
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>

            <label>
                <input className='input'
                    placeholder='unsername or email'
                    type="text"
                    value={credential}
                    onChange={e => setCredential(e.target.value)}
                    required />

            </label>
            <div>
                <label>

                    <input className='input'
                        placeholder='password'
                        type='text'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required />
                </label>
                {errors.credential && (
                    <p>{errors.credential}</p>
                )}
            </div>

            <button type="submit">Log In</button>

        </form>
        </>
    )
}
export default LoginFormModal;
