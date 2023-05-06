import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import * as sessionEvent from '../../store/event'
import EventDetail from './EventDetails'
import Navigation from '../Navigation'

function Events() {
    const dispatch = useDispatch();
    const history = useHistory()
    const eventList = useSelector(state => Object.values(state.event))

     const [eventD, setEventD] = useState(false)

    useEffect(() => {
        dispatch(sessionEvent.fetchEvents())
    }, [dispatch])



    if(eventD === true) {
        history.push('/events/:eventId')

    }


    return (
        <>
        <div>Events <Link to='/groups'>Groups</Link></div>
      
        {eventList.map(event => (
            <div>
                <Link to={`/events/${event.id}`} onClick={() => setEventD(true)}>
                <ul key={event.id}>{event.name}</ul>
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
