import React from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import CreateEvent from '../Events/CreateEvent'
import DeleteModal from '../DeleteModal'
import './groupDetail.css'

function GroupDetail() {
    const { groupId } = useParams();

    const history = useHistory()

    const group = useSelector(state => state.group[groupId])
    const user = useSelector(state => state.session.user)
    const event = useSelector(state => Object.values(state.event))

    const [theUser, setTheUser] = useState(false)
    const [numEvents, setNumEvents] = useState(0)
    const [pastEvents, setPastEvents] = useState(0)
    const [typeButton, setTypeButton] = useState('')


    useEffect(() => {
        setNumEvents(upcoming.length / 2)
        setPastEvents(past.length)
    }, [numEvents, pastEvents])



    useEffect(() => {

        if (user && user.id !== group.organizerId) {
            setTypeButton('joinButton')
            setTheUser(false)
        }
        if (user && user.id === group.organizerId) {
            setTheUser(true)
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

    let upcoming = []
    let past = []
    const allEvents = (groupId) => {
        for (let i = 0; i < event.length; i++) {
            let oneEvent = event[i]

            if (oneEvent.groupId === groupId) {
                if (oneEvent.name !== null) {

                    let date = Date.now()
                    let startDate = Date.parse(oneEvent.startDate)

                    if (startDate > date) {
                        upcoming.push([oneEvent.name, oneEvent.type, oneEvent.startDate, oneEvent.endDate, oneEvent.Venue.city, oneEvent.Venue.state])
                    } else {
                        past.push([oneEvent.name, oneEvent.type, oneEvent.startDate, oneEvent.endDate, oneEvent.Venue.city, oneEvent.Venue.state])
                    }
                }
            }

        }

    }

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
                <span className='groupImage'><img src='' alt='' width='200' height='200' /></span>
                <span className='name'>{group?.name}
                    <div className='location'>{group?.city}, {group?.state}</div>
                    <div>
                        <span className='events'>{numEvents} events</span>
                        <span className='public'>public</span>
                    </div>
                    {/* <div className='organizer'>Organized by: {user.firstName} {user.lastName}</div> */}

                    <div>
                        {theUser ? (
                            <>
                                <button onClick={() => createEvent(group)}>Create Event</button>
                                <button onClick={() => EditGroup(group)}>Update</button>
                                <button onClick={openMenu}>Delete</button>
                                <button onClick={() => history.push('/groups')}>back</button>
                                <div className={divClassName} ref={ulRef}>
                                  <DeleteModal groupId={group.id}/>
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
            {/* <div className='name'>{user.firstName} {user.lastName}</div> */}
            <div className='about'>What We're About:</div>
            <div className='description'>{group.about}</div>

            <div className='upcomingEvents'>{allEvents(group.id)}Upcoming Events ({numEvents})</div>
            {upcoming.map(event => (
                <ul key={event.id}>

                    <div className='upcomingEventsListContainer'>
                        <span><img src='' alt='' height='100px' width='100px' /></span>
                        <span>{event[3]}
                            <div className='eventName'>{event[0]}</div>
                            <div className='eventLocation'>{event[4]}, {event[5]} </div>
                        </span>
                    </div>

                </ul>
            ))}

            <div className='pastEvents'>{allEvents(group.id)}Past Events ({pastEvents})</div>
            {past.map(event => (
                <ul key={event.id}>

                    <div className='upcomingEventsListContainer'>
                        <span><img src='' alt='' height='100px' width='100px' /></span>
                        <span>{event[3]}
                            <div className='eventName'>{event[0]}</div>
                            <div className='eventLocation'>{event[4]}, {event[5]} </div>
                        </span>
                    </div>

                </ul>
            ))}
        </div>


        </>
    )
}

export default GroupDetail;
