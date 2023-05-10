import { Link, useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as sessionEvent from '../../store/event'
import { useState } from 'react'
import Events from './index'
import './EventDetail.css'
import clockIcon from './EventImages/clockIcon.png'

function EventDetail() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { eventId } = useParams();

    const event = useSelector(state => state.event[eventId])
    const user = useSelector(state => state.session.user)

    console.log(event, "IN EVENTDETAIL")

    const removeEvent = () => {
        dispatch(sessionEvent.eventRemover(eventId))
        return history.push('/events')
    }


    return (
        <>
            <div className='eventTopContainer'>
                <div className='backLink'><Link to='/events'> Events</Link>
                <div className='eventName'>{event.name}</div>
                <div className='organizer'>Hosted by: {user.firstName} {user.lastName}</div>
                </div>
            </div>

         <div className='eventMiddleContainer'>
           <div className='image1Box'> <img src='' alt='event1' height='100' width='100' /></div>
            <span className='image2Box'><img className='insideImage2'src='' alt='event2' height='100' width='50' />

            <div className='middleBottomContainer'>
                <div><img className='clockIcon'src={clockIcon} height='30' /></div>
                <span>Start
                <div>End</div>
                </span>



                <div>Free</div>
                <div>In Person</div>
            </div>
            </span>
         </div>


            <div className='eventbottomContainer'>
            <div className='eventDetails'>Details:
                <div className='eventDescription'>{event.description}</div>
                <div className='deleteButton'><button onClick={() => removeEvent()}>Delete</button></div>
            </div>


            </div>

        </>
    )
}

export default EventDetail;
