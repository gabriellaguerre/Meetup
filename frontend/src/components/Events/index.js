import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useState} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import * as sessionEvent from '../../store/event'
import EventDetail from './EventDetails'
import Navigation from '../Navigation'
import './index.css'

function Events() {
    const dispatch = useDispatch();
    const history = useHistory()
    const eventList = useSelector(state => Object.values(state.event))

     const [eventD, setEventD] = useState(false)

    console.log(eventList)


    useEffect(() => {
        dispatch(sessionEvent.fetchEvents())
    }, [dispatch])



    if(eventD === true) {
        history.push('/events/:eventId')

    }


    return (
        <>
        <span className='eventEvent'>Events </span>
        <span><NavLink className='eventGroup' to='/groups'> Groups</NavLink></span>
        <div className='smallHeader'>Events in get2gether</div>

        {eventList.map(event => (
            <div className='eventListContainer'>
                <NavLink className='eventListLink'to={`/events/${event.id}`} onClick={() => setEventD(true)}>
                <ul className='eventList' key={event.id}>
                    <span><img src='' alt='random pic' width="100" height="100" /></span>
                    <div className='eventDate'>{event.startDate}
                    <div className='eventName'>{event.name}</div>
                    <div className='eventLocation'>{event.Venue.city}, {event.Venue.state}</div>



                    </div>





                    </ul>
                {/* <li>Organizer ID: {group.organizerId}</li>
                <li>Name: {group.name}</li>/home/gabriel/appacademy-2022-meetup-project/Meetup/frontend/src/context
                <li>About: {group.about}</li> */}
            </NavLink>
            </div>
        ))}

        </>
    )
}

export default Events
