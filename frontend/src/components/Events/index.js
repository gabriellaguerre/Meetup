import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useState} from 'react'
import {Link, Route} from 'react-router-dom'
import * as eventActions from '../../store/event'
import EventDetail from './EventDetails'

import Navigation from '../Navigation'

function Events() {
    const dispatch = useDispatch();
    const eventList = useSelector(state => Object.values(state.event))

     const [eventD, setEventD] = useState(false)

    useEffect(() => {
        dispatch(eventActions.fetchEvents())
    }, [dispatch])



    if(eventD === true) {
        return (
            <>
            <Route path='/events/:id'>
            <EventDetail />
            </Route>
            </>
            )
    }


    return (
        <>
        <div>Events</div>
        <span><Link to='/groups'>Groups</Link></span>
        {eventList.map(event => (
            <div>
                <Link to={`/events/${event.id}`} onClick={() => setEventD(true)}>
                <li key={event.id}>{event.name}</li>
                {/* <li>Organizer ID: {group.organizerId}</li>
                <li>Name: {group.name}</li>/home/gabriel/appacademy-2022-meetup-project/Meetup/frontend/src/context
                <li>About: {group.about}</li> */}
            </Link>
            </div>
        ))}

        </>
    )
}

export default Events
