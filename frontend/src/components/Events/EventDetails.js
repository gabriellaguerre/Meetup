import React, { useRef, useEffect } from 'react'
import { NavLink, Link, useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as sessionEvent from '../../store/event'
import * as groupActions from '../../store/group'
import * as sessionUser from '../../store/session'
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

    useEffect(() => {
        dispatch(groupActions.fetchGroups())
    },[dispatch])

    useEffect(() => {
        dispatch(sessionEvent.fetchEvents())
        dispatch(sessionUser.restoreUser())
    }, [dispatch])

   // const group = useSelector(state => Object.values(state.group))
    const event = useSelector(state => state.event[eventId])
    const user = useSelector(state => state.session.user)

    const groupId = event?.groupId
   // console.log(groupId, "GROUP ID IN EVENT DETAILS")

    const group = useSelector(state => state.group[groupId])
 //   console.log(group, "GROUP IN EVENT DETAILS")

  // console.log(event, "EVENT IN EVENT DETAILS LINE 33")


    const [theUser, setTheUser] = useState(false)
    const [typeButton, setTypeButton] = useState('')



    useEffect(() => {
//event?.Group.organizerId

        if (user && user.id !== group?.organizerId) {
            setTypeButton('joinButton')
            setTheUser(false)
        }

        if (user && user.id === group?.organizerId) {
            setTheUser(true)
        }

        // if (user) {
        //     setTypeButton('joinButton')
        // }

        if (!user) {
            setTypeButton('noJoinButton')
            setTheUser(false)

        }

    }, [user, typeButton])



    // const removeEvent = async (eventId, groupId) => {
    //   return await dispatch(sessionEvent.eventRemover(eventId))
    //        //  .then(history.push('/events'))
    //          .then(history.push(`/groups/${groupId}`))
    // }

    // const updateEvent =  (eventId) => {
    //     return await dispatch(sessionEvent.eventRemover(eventId))
    //            .then(history.push(`/events`))
    //   }

    let newDate = new Date(event?.startDate)
    const date = newDate.toString().slice(0, 15)


    let endingDate = new Date(event?.endDate)
    const stopDate = endingDate.toString().slice(0, 15)


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

    ///////////////////////////////////////////////////////////////////


    return (
        <>
            <div className='eventTopContainer'>
                <div className='backLink'><Link to='/events'> Events</Link>
                    <div className='eventName'>{event?.name}</div>
                    {theUser ? (
                        <div className='organizer'>Hosted by: {user?.firstName} {user?.lastName}</div>
                    ) : (
                        <div></div>
                    )}

                </div>
            </div>

            <div className='wrapperMiddleContainer'>
                <div className='image1Box'> <img src={event?.eventImg} alt='event1' height='250' width='290' /></div>
                <div>

                <NavLink className='eventDetailsGroupLink' to={`/groups/${group?.id}`}>
                <div className='image2Box'>
                <img className='insideImage2' src={group?.groupImg} height='100' width='100' alt='event2' />
                <span>{group?.name}
                {group?.private ? (
                            <span className='public'>Private</span>
                        ) : (
                            <span className='public'>Public</span>
                        )}
                </span>

                </div>
                </NavLink>
                </div>


                <div className='clock'>
                    <div className='wrapperClock'>
                        <div className='clockImg'><img src={clockIcon} alt='clock' height='20' width='20' /></div>
                        <div className='start'>Start</div>
                        <div className='end'>End</div>
                        <div className='startDate'>{date} <span className='dotEventDet'>.</span> {event?.startTime}</div>
                        <div className='endDate'>{stopDate} <span className='dotEventDet'>.</span> {event?.endTime}</div>
                        <div className='money'><img src={moneyIcon} alt='Money' height='20' width='20' /></div>
                        <div className='free'>{event?.price}</div>
                        <div className='pin'><img src={pinIcon} alt='pin' height='20' width='20' /></div>
                        {event?.type ? (
                            <div className='inPerson'>{event?.type}</div>
                        ) : (
                            <div className='inPerson'>In person</div>
                        )}

                    </div>
                </div>

            </div>

            <div className='eventbottomContainer'>
                <div className='eventDetails'>Description:
                    <div className='eventDescription'>{event?.description}</div>
                    <div>
                        {theUser && (
                            <>
                                <div className='deleteButton'><button onClick={openMenu}>Delete</button></div>
                                <div className='updateButton'><button>Update</button></div>
                                <div className={divClassName} ref={ulRef}>
                                    <EventDeleteModal eventId={event.id} groupId={event.groupId} />
                                </div>
                            </>

                        )}
                        {user && !theUser && (
                            <button className={typeButton}>Join Event</button>
                        )}
                        {!user && !theUser && (
                            <button className={typeButton}>Create an account to Join the Group and Event</button>
                        )}
                    </div>

                </div>


            </div>

        </>
    )
}

export default EventDetail;
