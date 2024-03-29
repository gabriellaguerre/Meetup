import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import * as eventActions from '../../store/event'
// import EventDetail from './EventDetails'
// import Navigation from '../Navigation'
import './index.css'

function Events() {
    const dispatch = useDispatch();
    const history = useHistory()

useEffect(() => {
        dispatch(eventActions.fetchEvents())
    }, [dispatch])

    const eventList = useSelector(state => Object.values(state.event))

    const [eventD, setEventD] = useState(false)

    let orderList = []
    for(let i = 0; i < eventList.length; i++) {
        let event = eventList[i]
        orderList.unshift(event)
    }





    if (eventD === true) {
        history.push('/events/:eventId')

    }
    // let newDate = new Date(event?.startDate)
    // const date = newDate.toString().slice(0, 15)

    function convertDate(date) {
        let newDate = new Date(date)
        return newDate.toString().slice(0,15)
    }

    function convertTime(time) {
        const [hours, minutes] = time.split(':');
        const hoursNum = parseInt(hours, 10);
        const minutesNum = parseInt(minutes, 10);
        const period = hoursNum < 12 ? "AM" : "PM";
        return `${formatHours(hoursNum)}:${minutesNum.toString().padStart(2, '0')} ${period}`;
    }

    function formatHours(hours) {
        return (hours % 12 || 12).toString();
      }


    return (
        <>
            <span className='eventEvent'>Events </span>
            <span><NavLink className='eventGroup' to='/groups'> Groups</NavLink></span>
            <div className='smallHeader'>Events in get2gether</div>

            {orderList.map(event => (
                <div key={event.id} className='eventListContainer'>
                    <NavLink className='eventListLink' to={`/events/${event.id}`} onClick={() => setEventD(true)}>
                        <ul className='eventList' key={event.id}>
                            <span><img className='eventimageImage' src={event.eventImg} alt='random pic' width="100" height="100" /></span>
                            <div className='eventDate'>{convertDate(event.startDate)} -- {convertTime(event.startTime)}
                                <div className='eventName'>{event.name}</div>
                                <div className='eventLocation'>{event.Group?.city}, {event.Group?.state}</div>
                                <div className='eventDescription'>{event.description}</div>
                            </div>

                        </ul>

                    </NavLink>
                </div>
            ))}

        </>
    )
}

export default Events;
