import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import * as sessionEvent from '../../store/event'
import * as sessionGroup from '../../store/group'
import './CreateEvent.css'


function CreateEvent() {
    const { groupId } = useParams()
    const group = useSelector(state => state.group[groupId])
    const event = useSelector(state => Object.values(state.event))
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch()
    const history = useHistory()

useEffect(()=> {
    dispatch(sessionGroup.fetchGroups())
}, [dispatch])


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
    const [goToPage, setGoToPage] = useState(false)
    const [hasFilled, setHasFilled] = useState(false)
    const [fieldBackground, setFieldBackground] = useState('blueFields')



     useEffect(() => {
         let errors = {}

    console.log(name.length, hasFilled)
            if (name.length === 0 && hasFilled) {
                errors.name = "*Name is required"
            }

            if(description.length === 0 && hasFilled) {
                errors.description = "*Description is required"
            }

            if(type.length === 0 && hasFilled) {
                errors.type = "*Type is required"
            }

            if(privatePublic.length === 0 && hasFilled) {
                errors.privatePublic = "*Choose between Private or Public"
            }

            if(price.length === 0 && hasFilled) {
                errors.price = "*Price is required"
            }

            if(hasFilled && (startDate.length === 0 || startTime.length === 0)) {
                errors.startDate = "*Starting Date and Starting Time are required"
            }

            if(hasFilled && (endDate.length === 0 || endTime.length === 0)) {
                errors.endDate = "*Ending Date and Ending Time are required"
            }

            if(eventImg.length === 0 && hasFilled) {
                errors.eventImg = "*Please add an image url for your event"
            }


        if(errors) {
            setValidationErrors(errors)
            setDisable(true)
        } else {
            setDisable(false)
            setValidationErrors({})
        }


     }, [hasFilled, name, description, type, privatePublic, price, startDate, startTime, endDate, endTime, eventImg])

     if (user === null) {
        return history.push('/')
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        setValidationErrors({})
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


        return dispatch(sessionEvent.creatingEvent(form2, groupId))
               //.then(dispatch(sessionEvent.fetchEvents()))
               .then(() => setGoToPage(true))
               .catch(async (res) => {
                const data = await res.json()
                if(data && data.errors) {
                    setValidationErrors(data.errors)
                    setDisable(true)
                }
               })

    }

    if (goToPage) {
        console.log(event, "IN HISTORY PUSH CODE LINE 140")
        history.push(`/events/${event[event.length - 1].id}`)
    }


    return (
        <form onSubmit={handleSubmit}>

            <h3>Create an event for {group?.name}</h3>
            <p>What is the name of your event?</p>
            <input className={fieldBackground}
                placeholder='Event Name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                onClick={()=> {setHasFilled(true);setFieldBackground('whiteFields')}}/>

            <div className='errors'>
            {validationErrors.name && (
            <p>{validationErrors.name}</p>
            )}
            </div>


            <p>Is this an in person or online event?</p>
            <select value={type} onChange={(e) => setType(e.target.value)}
            onClick={()=> setHasFilled(true)}>
                <option value='' disabled>(select one)</option>
                <option>In person</option>
                <option>Online</option>
            </select>
            <div className='errors'>
            {validationErrors.type && (<p>{validationErrors.type}</p>)}
            </div>

            <p>Is this group private or public?</p>
            <select value={privatePublic} onChange={(e) => setPrivatePublic(e.target.value)}
            onClick={()=> setHasFilled(true)}>
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
                onChange={(e) => setPrice(e.target.value)}
                onClick={()=> setHasFilled(true)}/>
            <div className='errors'>
            {validationErrors.price && (<p>{validationErrors.price}</p>)}
            </div>


            <p>When does your event start?</p>
            <input className='start'
                placeholder='MM/DD/YYYY HHmm AM'
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onClick={()=> setHasFilled(true)} />
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
                onChange={(e) => setEndDate(e.target.value)}
                onClick={()=> setHasFilled(true)} />
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
                onChange={(e) => setEventImg(e.target.value)}
                onClick={()=> setHasFilled(true)} />
            <div className='errors'>
            {validationErrors.eventImg && (<p>{validationErrors.eventImg}</p>)}
            </div>

            <p>Please describe your event</p>
            <textarea
                placeholder='Please include at least 30 characters'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onClick={()=> setHasFilled(true)} />
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
