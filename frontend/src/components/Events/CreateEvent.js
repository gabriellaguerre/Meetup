import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import * as sessionEvent from '../../store/event'


function CreateEvent() {
    const { groupId } = useParams()
    const group = useSelector(state => state.group[groupId])
    const event = useSelector(state => state.event)

    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch()
    const history = useHistory()

    console.log("IN CREATE EVENT LINE 18")


    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('')
    const [privatePublic, setPrivatePublic] = useState('')
    const [price, setPrice] = useState('')
    const [startDate, setStartDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [endDate, setEndDate] = useState('')
    const [eventImg, setEventImg] = useState('')
    const [validationErrors, setValidationErrors] = useState({})
    const [disable, setDisable] = useState(true)

     useEffect(() => {
        let errors = {}
        if(name.length === 0) {
            errors.name = "Name is required"

        }
        if(description.length === 0) {
            errors.description = "Description is required"
        }

        if(type.length === 0) {
            errors.type = "Type is required"
        }

        if(privatePublic.length === 0) {
            errors.privatePublic = "Choose between Private or Public"
        }

        if(price.length === 0) {
            errors.price = "Price is required"
        }

        if(startDate.length === 0 || startTime.length === 0) {
            errors.startDate = "Starting Date and Starting Time are required"
        }

        if(endDate.length === 0 || endTime.length === 0) {
            errors.endDate = "Ending Date and Ending Time are required"
        }

        if(eventImg.length === 0) {
            errors.eventImg = "Please add an image url for your event"
        }

        if(name.length > 0 && name.length < 5) {
            errors.name = "Name must be at least 5 characters"
        }

        if(description.length < 30) {
            errors.description = "Description must be at least 30 characters"
        }

        if(Object.values(errors).length) {
            setValidationErrors(errors)
            setDisable(true)
        } else {
            setDisable(false)
        }

     }, [name, description, type, privatePublic, price, startDate, startTime, endDate, endTime, eventImg])

    //  const firstErrors = () => {

    //         let errors = {}
    //         if(name.length === 0) {
    //             errors.name = "Name is required"

    //         }
    //         if(description.length === 0) {
    //             errors.description = "Description is required"
    //         }

    //         if(type.length === 0) {
    //             errors.type = "Type is required"
    //         }

    //         if(privatePublic.length === 0) {
    //             errors.privatePublic = "Choose between Private or Public"
    //         }

    //         if(price.length === 0) {
    //             errors.price = "Price is required"
    //         }

    //         if(startDate.length === 0 || startTime.length === 0) {
    //             errors.startDate = "Starting Date and Starting Time are required"
    //         }

    //         if(endDate.length === 0 || endTime.length === 0) {
    //             errors.endDate = "Ending Date and Ending Time are required"
    //         }

    //         if(eventImg.length === 0) {
    //             errors.eventImg = "Please add an image url for your event"
    //         }

    //         setValidationErrors(errors)

    //  }

    const handleSubmit = (e) => {
        e.preventDefault()
        setDisable(false)


        const form = {
            venueId: 1,
            name,
            description,
            type,
            privatePublic,
            price,
            startDate,
            startTime,
            endDate,
            endTime,
            eventImg
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
            startTime,
            endDate,
            endTime,
            eventImg
        }

        setValidationErrors({})
        return dispatch(sessionEvent.creatingEvent(form2, groupId))
            .then(() => history.push(`/events`))
               .catch(async (res) => {
                const data = await res.json()
                if(data && data.errors) {
                    setValidationErrors(data.errors)
                    setDisable(true)
                }
               })

    }


    return (
        <form onSubmit={handleSubmit}>

            <h3>Create an event for {group.name}</h3>
            <p>What is the name of your event?</p>
            <input
                placeholder='Event Name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                />

            <div className='errors'>
            {validationErrors.name && (<p>{validationErrors.name}</p>)}
            </div>

            <p>Is this an in person or online event?</p>
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value='' disabled>(select one)</option>
                <option>In person</option>
                <option>Online</option>
            </select>
            <div className='errors'>
            {validationErrors.type && (<p>{validationErrors.type}</p>)}
            </div>

            <p>Is this group private or public?</p>
            <select value={privatePublic} onChange={(e) => setPrivatePublic(e.target.value)}>
                <option value='' disabled>(select one)</option>
                <option value='true'>Private</option>
                <option value='false'>Public</option>
            </select>
            <div className='errors'>
            {validationErrors.privatePublic && (<p>{validationErrors.privatePublic}</p>)}
            </div>

            <p>What is the price for you event? </p>
            <input
                placeholder='$'
                type='number'
                value={price}
                onChange={(e) => setPrice(e.target.value)} />
            <div className='errors'>
            {validationErrors.price && (<p>{validationErrors.price}</p>)}
            </div>


            <p>When does your event start?</p>
            <input className='start'
                placeholder='MM/DD/YYYY HHmm AM'
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)} />
            <input className='startTime'
                   placeholder='Event Start Time'
                   type='time'
                   value={startTime}
                   onChange={(e) => setStartTime(e.target.value)}
            />
            <div className='errors'>
            {validationErrors.startDate && (<p>{validationErrors.startDate}</p>)}
            </div>

            <p>When does your event end?</p>
            <input className='end' width='100px'
                placeholder='MM/DD/YYYY HHmm PM'
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)} />
            <input className='endTime'
                   placeholder='Event End Time'
                   type='time'
                   value={endTime}
                   onChange={(e) => setEndTime(e.target.value)}
            />
            <div className='errors'>
            {validationErrors.endDate && (<p>{validationErrors.endDate}</p>)}
            </div>

            <p>Please add an image url for your event below</p>
            <input
                placeholder='Image Url'
                type='text'
                value={eventImg}
                onChange={(e) => setEventImg(e.target.value)} />
            <div className='errors'>
            {validationErrors.eventImg && (<p>{validationErrors.eventImg}</p>)}
            </div>

            <p>Please describe your event</p>
            <textarea
                placeholder='Please include at least 30 characters'
                value={description}
                onChange={(e) => setDescription(e.target.value)} />
            <div className='errors'>
            {validationErrors.description && (<p>{validationErrors.description}</p>)}
            </div>

            <p>
                <button disabled={disable} onClick={handleSubmit}>Create Event</button>
                <button onClick={()=> history.push('/events')}>Cancel</button>
            </p>
        </form>
    )
}


export default CreateEvent
