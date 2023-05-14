import React, {useRef, useEffect} from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as sessionEvent from '../../store/event'
import DeleteModal from '../DeleteModal'
import { useState } from 'react'
import EventDeleteModal from '../EventDeleteModal/EventDeleteModal'
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



    // const removeEvent = async (eventId, groupId) => {
    //   return await dispatch(sessionEvent.eventRemover(eventId))
    //        //  .then(history.push('/events'))
    //          .then(history.push(`/groups/${groupId}`))
    // }

    // const updateEvent =  (eventId) => {
    //     return await dispatch(sessionEvent.eventRemover(eventId))
    //            .then(history.push(`/events`))
    //   }

let newDate = new Date(event.startDate)
const date = newDate.toString().slice(0,15)
const time = newDate.toString().slice(16,21)

let endingDate = new Date(event.endDate)
const stopDate = endingDate.toString().slice(0,15)
const stopTime = endingDate.toString().slice(16,21)

 ////////////////////////////////////////////////////////
 const [showMenu, setShowMenu] = useState(false)
 const ulRef = useRef()

 const openMenu = () => {
     setShowMenu(true)

     if (showMenu) return;

    
 }

 const closeMenu = (e) => {
     //console.log(ulRef.current.contains(e.target), "IN CLOSE MENU")
     // if (!ulRef.current.contains(e.target) ) {
         setShowMenu(false)
     // }
 }


 useEffect(() => {
     if (!showMenu) return


     // const closeMenu = (e) => {
     //     console.log(ulRef.current.contains(e.target), "IN CLOSE MENU")
     //     if (!ulRef.current.contains(e.target) ) {
     //         setShowMenu(false)
     //     }
   //  }

     document.addEventListener('click', closeMenu)

     return () => document.removeEventListener('click', closeMenu)
 }, [showMenu])

 const divClassName = "delete-dropdown" + (showMenu ? "" : "hidden")
 console.log(divClassName, "DIVCLASSNAME")

///////////////////////////////////////////////////////////////////

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
                   <div className='startDate'>{date} <span className='dotEventDet'>.</span> {time} hours</div>
                   <div className='endDate'>{stopDate} <span className='dotEventDet'>.</span> {stopTime} hours</div>
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
                <div className='deleteButton'><button onClick={openMenu}>Delete</button></div>
                <div className='updateButton'><button>Update</button></div>
                <div className={divClassName} ref={ulRef}>
                        <EventDeleteModal eventId={event.id} groupId={event.groupId}/>
                </div>
            </div>


            </div>

        </>
    )
}

export default EventDetail;
