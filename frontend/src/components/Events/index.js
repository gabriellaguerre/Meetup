import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import * as eventActions from '../../store/event'
import EventDetail from './EventDetails'
import Navigation from '../Navigation'
import './index.css'

function Events() {
    const dispatch = useDispatch();
    const history = useHistory()

useEffect(() => {
        dispatch(eventActions.fetchEvents())
    }, [dispatch])

    const eventList = useSelector(state => Object.values(state.event))
    console.log(eventList)

    const [eventD, setEventD] = useState(false)







    if (eventD === true) {
        history.push('/events/:eventId')

    }


    return (
        <>
            <span className='eventEvent'>Events </span>
            <span><NavLink className='eventGroup' to='/groups'> Groups</NavLink></span>
            <div className='smallHeader'>Events in get2gether</div>

            {eventList.map(event => (
                <div key={event.id} className='eventListContainer'>
                    <NavLink className='eventListLink' to={`/events/${event.id}`} onClick={() => setEventD(true)}>
                        <ul className='eventList' key={event.id}>
                            <span><img src={event.eventImg} alt='random pic' width="100" height="100" /></span>
                            <div className='eventDate'>{event.startDate}
                                <div className='eventName'>{event.name}</div>
                                <div className='eventLocation'>New York, NY</div>

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

export default Events;
