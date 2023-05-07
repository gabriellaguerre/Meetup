import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useState} from 'react'
import {Link, NavLink, useHistory} from 'react-router-dom'
import * as groupActions from '../../store/group'
import * as eventActions from '../../store/event'
import boatImage from '../HomePage/HomePageImages/boatImage.png'
import carCollector from '../HomePage/HomePageImages/carCollectorsImage.png'
import hunterImage from '../HomePage/HomePageImages/hunterImage.png'
import skyDive from '../HomePage/HomePageImages/skyDiveImage.png'
import './index.css'

function Groups() {
    const history = useHistory()
    const dispatch = useDispatch();
    const groupList = useSelector(state => Object.values(state.group))
    const eventList = useSelector(state => Object.values(state.event))

    const [groupD, setGroupD] = useState(false)

    useEffect(() => {
        dispatch(groupActions.fetchGroups());
    }, [dispatch])

    const getEventByGroup = (groupId) => {
     let numEvents = dispatch(eventActions.findEvents(groupId))
     console.log(numEvents)
       return numEvents
    }



    if(groupD === true) {
        history.push('/groups/:groupId')
    }

    // let images = [boatImage, carCollector, hunterImage, skyDive]
    // let randomNum = Math.floor(Math.random() * images.length);
    // const pic = images[randomNum]

    return (
        <>
        <span><NavLink className='groupEvent' to='/events'>Events</NavLink></span>
        <span className='groupGroup'>Groups</span>
        <div className='smallHeader'>Groups in get2gether</div>

        {groupList.map(group => (
            <div className='groupListContainer'>
                <NavLink className='groupListLink'to={`/groups/${group.id}`} onClick={() => setGroupD(true)}>
                <ul className='groupList' key={group.id}>
                    <span><img src='' alt='random pic' width="100" height="100"/></span>
                    <div className='groupInfo'>{group.name}
                    <div className='location'>{group.city},{group.state}</div>
                    <div className='about'>{group.about}</div>
                    <div className='private'>{group.private}</div>
                    <div className='event' >Events: </div>
                    </div>
                    </ul>
                {/* <li>Organizer ID: {group.organizerId}</li>
                <li>Name: {group.name}</li>/home/gabriel/appacademy-2022-meetup-project/Meetup/frontend/src/context
                <li>About: {group.about}</li> */}
                </NavLink>
            </div>
        ))}

        </>
    )
}

export default Groups
