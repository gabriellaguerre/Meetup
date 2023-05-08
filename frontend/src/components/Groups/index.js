import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Link, NavLink, useHistory } from 'react-router-dom'
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

    console.log(eventList, "EVENTLIST IN GROUPS")

    const [groupD, setGroupD] = useState(false)
    const [events, setEvent] = useState([])
    const [groupId, setGroupId] = useState()


    useEffect(() => {
        dispatch(groupActions.fetchGroups());
    }, [dispatch])

    useEffect(() => {
        dispatch(eventActions.fetchEvents())
    }, [dispatch])

    // let count = 0;

  //  const counter = (groupId) => {
        // eventList.map(event => {
        //     console.log(event, "EVENT")
        //     console.log(event.groupId, groupId, event.groupId === groupId, "IN COUNTER LOGIC")
        //     if (event.groupId === groupId) {
        //         count = count + 1
        //         console.log(count)
        //     }
       // })
        // return count
        // for(let i = 0; i < eventList.length; i++) {
        //     let event = eventList[i]
        //     if(event.groupId === groupId) {
        //         console.log(event.groupId, groupId, event.groupId === groupId)
        //         console.log("YES")
        //     }
            //console.log(event, "IN FOR LOOP");
   //     }

  //  }
  //  console.log(counter(groupId))

  const count = async (groupId) => {
    await eventList.count({
        groupId: groupId
    })}


    if (groupD === true) {
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
                    <NavLink className='groupListLink' to={`/groups/${group.id}`} onClick={() => setGroupD(true)}>
                        <ul className='groupList' key={group.id}>
                            <span><img src='' alt='random pic' width="100" height="100" /></span>
                            <div className='groupInfo'>{group.name}
                                <div className='location'>{group.city},{group.state}</div>
                                <div className='about'>{group.about}</div>
                                <div>
                                    {/* {eventList.map(event => (
                                    <ul key={event.groupId}>
                                        if({event.groupId} === {group.id}) {
                                        <div>hello</div>
                                    }
                                    </ul>
                                ))} */}
                                    <span className='event' >{count(group.id)}# events </span>
                                    <span className='dot'>.</span>
                                    <span className='private'>private {group.privatePublic}</span>
                                </div>
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

export default Groups;
