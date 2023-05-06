import { Link, useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as sessionEvent from '../../store/event'
import { useState } from 'react'
import Events from './index'

function EventDetail() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { eventId } = useParams();

    const event = useSelector(state => state.event[eventId])

    const removeEvent = () => {
        dispatch(sessionEvent.eventRemover(eventId))
        history.push('/events')
    }


    return (
        <>

            <Link to='/events'> Back to Events</Link>
            <section> Name:
                {event.name}
                <br /> Organizer:
                { }
                <br />
                What We Are About:
                <p>
                    { }
                </p>
                <br />
            </section>
            <button onClick={() => removeEvent()}>Delete</button>
        </>
    )
}

export default EventDetail;
