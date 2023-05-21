import React from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import * as groupActions from '../../store/group'
import * as sessionUser from '../../store/session'
import CreateEvent from '../Events/CreateEvent'
import DeleteModal from '../DeleteModal'
import './groupDetail.css'

function GroupDetail() {

    const dispatch = useDispatch()
    const { groupId } = useParams();

    useEffect(() => {
        dispatch(groupActions.fetchGroups())
        dispatch(sessionUser.restoreUser())

    }, [dispatch])

    const group = useSelector(state => state.group[groupId])


    const user = useSelector(state => state.session.user)
    // const event = useSelector(state => Object.values(state.event))
    // console.log(event, "EVENT IN GROUP DETAIL")

    const history = useHistory()

    const [theUser, setTheUser] = useState(false)
    const [typeButton, setTypeButton] = useState('')


    const countUpcoming = group?.Events?.filter(event =>
        Date.parse(event?.startDate) > Date.now()
   )

   const countPast = group?.Events?.filter(event =>
        Date.parse(event?.startDate) < Date.now()
    )



    // useEffect(() => {
    //     setNumEvents(upcoming.length / 2)
    //     setPastEvents(past.length/2)
    // }, [numEvents, pastEvents])



    useEffect(() => {

        if (user && user.id === group?.organizerId) {
            setTheUser(true)
            setTypeButton('noJoinButton')
        }

        if (user && user.id !== group?.organizerId) {
            setTypeButton('joinButton')
            setTheUser(false)
        }

        if (!user) {
            setTypeButton('noJoinButton')

        }

    }, [user, typeButton])

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

    //     let upcoming = []
    //     let past = []
    //     const allEvents = () => {
    //         for (let i = 0; i < group.Events.length; i++) {
    //  //           console.log(group.Events.length, "EVENTS LENGTH")
    //             let oneEvent = group.Events[i]
    // //console.log(oneEvent, "ONE EVENT IN FOR LOOP")
    //             let date = Date.now()
    //             let startDate = Date.parse(oneEvent.startDate)
    // //console.log( "START DATE LOGIC")
    //             if (startDate > date && upcoming[0] !== oneEvent.name) {
    //                 upcoming.push([oneEvent.name, oneEvent.type, oneEvent.startDate, oneEvent.endDate, oneEvent.eventImg])
    //             } else if (startDate < date && past[0] !== oneEvent.name) {
    //                 past.push([oneEvent.name, oneEvent.type, oneEvent.startDate, oneEvent.endDate, oneEvent.eventImg])
    //             }
    //         }
    //         console.log(group.Events, "PAST IN FOR LOOP")

    //     }

    const EditGroup = (group) => {

        history.push(`/groups/${group.id}/edit`)
        return (
            <>
                <EditGroup group={group} />
            </>
        )
    }

    const createEvent = () => {
        history.push(`/groups/${group.id}/events/new`)
        return (
            <>
                <CreateEvent groupId={group.id} />
            </>
        )
    }


    const sendAlert = () => {
        return window.alert("Feature Coming Soon")
    }


    return (
        <>
            <div className='backLink'><Link to='/groups'> Groups</Link></div>
            <div className='topContainer'>
                <span className='groupImage'><img src={group?.groupImg} alt='' width='200' height='200' /></span>
                <span className='name'>{group?.name}
                    <div className='location'>{group?.city}, {group?.state}</div>
                    <div>
                        <span className='events'>{countUpcoming.length} Events</span>
                        <span className='dot'>.</span>
                        {group?.private ? (
                            <span className='public'>Private</span>
                        ) : (
                            <span className='public'>Public</span>
                        )}

                    </div>
                    <div className='organizer'>Organized by: {group?.Organizer?.firstName} {group?.Organizer?.lastName}</div>

                    <div>
                        {theUser ? (
                            <>
                                <button onClick={() => createEvent(group)}>Create Event</button>
                                <button onClick={() => EditGroup(group)}>Update</button>
                                <button onClick={openMenu}>Delete</button>
                                <button onClick={() => history.push('/groups')}>back</button>
                                <div className={divClassName} ref={ulRef}>
                                    <DeleteModal groupId={group?.id} />
                                </div>

                            </>
                        ) : (
                            <button onClick={() => sendAlert()} className={typeButton}>Join This Group</button>
                        )}

                    </div>
                </span >
            </div >

            <div className='bottomContainer'>
                <div className='organizer'> Organizer </div>

                <div className='name'>{group?.Organizer?.firstName} {group?.Organizer?.lastName}</div>


                <div className='about'>What We're About:</div>
                <div className='description'>{group?.about}</div>
            </div>

            <div className='upcomingEvents'>Upcoming Events ({countUpcoming.length})</div>
            {group?.Events?.map(event => (
                <ul key={event.id}>
                    {(Date.parse(event?.startDate) > Date.now()) ?  (
                        <div className='upcomingEventsListContainer'>

                            <span><img src={event?.eventImg} alt='' height='100px' width='100px' /></span>

                            <span>
                                <div className='eventName'>{event?.name}</div>
                                <div className='eventLocation'>{group?.city}, {group?.state} </div>
                                <div className='eventDescription'>{event?.description}</div>
                            </span>

                        </div>
                    ) : (
                        <div>No Upcoming Events</div>
                    )}

                </ul>
            ))}

            <div className='upcomingEvents'>Past Events ({countPast.length})</div>
            {group?.Events?.map(event => (
                <ul key={event.id}>
                    {(Date.parse(event?.startDate) < Date.now()) ? (
                        <div className='upcomingEventsListContainer'>
                            <span><img src={event?.eventImg} alt='' height='100px' width='100px' /></span>
                            <span>
                                <div className='eventName'>{event?.name}</div>
                                <div className='eventLocation'>{group?.city}, {group?.state} </div>
                                <div className='eventDescription'>{event?.description}</div>
                            </span>

                        </div>
                    ) : (
                        <div>No Past Events</div>
                    )}

                </ul>
            ))}
        </>
    )
}

export default GroupDetail;
