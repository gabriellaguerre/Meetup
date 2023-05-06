import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import * as sessionEvent from '../../store/event'


function CreateEvent() {
    const { groupId } = useParams()
    const group = useSelector(state => state.group[groupId])

    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch()
    const history = useHistory()

    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [type, setType] = useState()
    const [privatePublic, setPrivatePublic] = useState()
    const [price, setPrice] = useState()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [url, setUrl] = useState()
    const [errors, setErrors] = useState([])

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([])

        const form = {
            venueId: 1,
            name,
            description,
            type,
            privatePublic,
            price,
            startDate,
            endDate,
            url
        }
        const turnPrice = +price

        const form2 = {
            venueId: 1,
            name,
            description,
            type,
            privatePublic,
            price: turnPrice,
            startDate,
            endDate,
            url
        }
        return dispatch(sessionEvent.creatingEvent(form2, groupId))
            .then(() => history.push('/events'))
               .catch(async (res) => {
                const data = await res.json()
                if(data && data.errors) {
                    setErrors(data.errors)
                }
               })

    }

    return (
        <form>

            <h3>Create an event for {group.name}</h3>
            <p>What is the name of your event?</p>
            <input
                placeholder='Event Name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)} />
            <div className='errors' style={{backgroundColor: 'yellow'}}>
            {errors.name && (<p>{errors.name}</p>)}
            </div>

            <p>Is this an in person or online event?</p>
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value='' disabled>(select one)</option>
                <option>In person</option>
                <option>Online</option>
            </select>
            <div className='errors' style={{backgroundColor: 'yellow'}}>
            {errors.type && (<p>{errors.type}</p>)}
            </div>

            <p>Is this group private or public?</p>
            <select value={privatePublic} onChange={(e) => setPrivatePublic(e.target.value)}>
                <option value='' disabled>(select one)</option>
                <option value='true'>Private</option>
                <option value='false'>Public</option>
            </select>

            <p>What is the price for you event? </p>
            <input
                placeholder='$'
                type='number'
                value={price}
                onChange={(e) => setPrice(e.target.value)} />
            <div className='errors' style={{backgroundColor: 'yellow'}}>
            {errors.price && (<p>{errors.price}</p>)}
            </div>


            <p>When does your event start?</p>
            <input
                placeholder='MM/DD/YYYY HHmm AM'
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)} />
            <div className='errors' style={{backgroundColor: 'yellow'}}>
            {errors.startDate && (<p>{errors.startDate}</p>)}
            </div>

            <p>When does your event end?</p>
            <input
                placeholder='MM/DD/YYYY HHmm PM'
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)} />
            <div className='errors' style={{backgroundColor: 'yellow'}}>
            {errors.endDate && (<p>{errors.endDate}</p>)}
            </div>

            <p>Please add an image url for your group below</p>
            <input
                placeholder='Image Url'
                value={url}
                onChange={(e) => setUrl(e.target.value)} />
            <p>
                <p>Please describe your event</p>
            </p>
            <textarea
                placeholder='Please include at least 30 characters'
                value={description}
                onChange={(e) => setDescription(e.target.value)} />
            <div className='errors' style={{backgroundColor: 'yellow'}}>
            {errors.description && (<p>{errors.description}</p>)}
            </div>

            <p>
                <button onClick={handleSubmit}>Create Event</button>
                <button onClick={()=> history.push('/events')}>Cancel</button>
            </p>
        </form>
    )
}


export default CreateEvent
