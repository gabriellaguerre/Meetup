import { Link, useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as sessionEvent from '../../store/event'
import { useState } from 'react'
import Events from './index'
import './EventDetail.css'
import clockIcon from './EventImages/clockIcon.png'
import moneyIcon from './EventImages/moneyIcon.png'
import pinIcon from './EventImages/pinIcon.png'

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


let newDate = new Date(event.startDate)
console.log(newDate.toString(), "DATE AND TIME")
    return (
        <>
            <div className='eventTopContainer'>
                <div className='backLink'><Link to='/events'> Events</Link>
                <div className='eventName'>{event.name}</div>
                <div className='organizer'>Hosted by: {user.firstName} {user.lastName}</div>
                </div>
            </div>

         <div className='wrapperMiddleContainer'>
            <div className='image1Box'> <img src='' alt='event1' height='100' width='100' /></div>

            <div className='image2Box'><img className='insideImage2'src='' alt='event2' /></div>

            <div className='clock'>
                <div className='wrapperClock'>
                   <div className='clockImg'><img src={clockIcon} alt='clock' height='20'width='20'/></div>
                   <div className='start'>Start</div>
                   <div className='end'>End</div>
                   <div className='startDate'>{event.startDate}</div>
                   <div className='endDate'>{event.endDate}</div>
                   <div className='money'><img src={moneyIcon} alt='Money' height='20'width='20' /></div>
                   <div className='free'>{event.price}</div>
                   <div className='pin'><img src={pinIcon} alt='pin' height='20'width='20'/></div>
                    {event.type ? (
                        <div className='inPerson'>{event.type}</div>
                    ) : (
                        <div className='inPerson'>In person</div>
                    )}

                </div>
            </div>

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
