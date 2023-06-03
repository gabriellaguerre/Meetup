import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import * as groupActions from '../../store/group'
//import GroupDetail from './GroupDetails'
//import * as eventActions from '../../store/event'
// import boatImage from '../HomePage/HomePageImages/boatImage.png'
// import carCollector from '../HomePage/HomePageImages/carCollectorsImage.png'
// import hunterImage from '../HomePage/HomePageImages/hunterImage.png'
// import skyDive from '../HomePage/HomePageImages/skyDiveImage.png'
import './index.css'
//import noImage from './GroupImages/noImageAvailable.png'

function Groups() {
    const history = useHistory()
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(groupActions.fetchGroups());
    }, [dispatch])

    const groupList = useSelector(state => Object.values(state.group))
    //const eventList = useSelector(state => Object.values(state.event))

    const [groupD, setGroupD] = useState(false)
    // const [events, setEvent] = useState([])
    // const [groupId, setGroupId] = useState()


  //  console.log(groupList, "GROUP LIST IN GROUPS")

    let orderGroup = []
    for(let i = 0; i < groupList.length; i++) {
        let group = groupList[i]
        orderGroup.unshift(group)
    }

  //  console.log(orderGroup, "UNSHIFTED GROUP LIST")

    // useEffect(() => {
    //     dispatch(eventActions.fetchEvents())
    // }, [dispatch])


    // useEffect(() => {
    //     let count = []
    //     const counter = () => {
    //         for (let i = 0; i < groupList.length; i++) {
    //             for (let j = 0; j < eventList.length; j++) {
    //                 let group = groupList[i]
    //                 let event = eventList[j]

    //                 if (group.id === event.groupId) {
    //                     count.push(event)
    //                 }
    //             }
    //     }
    //     return count
    // }
    // }, [groupList, eventList])



    //     let arr = []
    //    const counter = async (groupId) =>{
    //       let count = await dispatch(eventActions.findEvents(groupId))
    //       console.log(count, "IN COUNTER")
    //       arr.push(count)
    //    }
    // console.log(arr)


    if (groupD === true) {
        history.push(`/groups/:groupId`)
    }



    // let pic;
    // let publicPrivate


    // groupList.map(group => {
    //     if(group.previewImage === "No Image posted"){
    //         pic = noImage
    //     } else {
    //         pic = group.previewImage
    //     }

    // if(group.private === true) {
    //     publicPrivate = 'Private'
    // } else if (group.private === null) {
    //     publicPrivate = 'Public'
    // } else {
    //     publicPrivate = 'Public'
    // }



    return (
        <>
            <span><NavLink className='groupEvent' to='/events'>Events</NavLink></span>
            <span className='groupGroup'>Groups</span>
            <div className='smallHeader'>Groups in get2gether</div>

            {orderGroup.map(group => (
                <div key={group.id} className='groupListContainer'>
                    <NavLink className='groupListLink' to={`/groups/${group.id}`} onClick={() => setGroupD(true)}>
                        <ul className='groupList' >
                            <span><img className='imageImage' src={group.groupImg} alt='random pic'  /></span>
                            <div className='groupInfo'>{group.name}
                                <div className='location'>{group.city},{group.state}</div>
                                <div className='about'>{group.about}</div>
                                <div>
                                    <span className='event' >{group.Events.length} Events </span>
                                    <span className='dot'>.</span>
                                    {group.private ? (
                                        <span className='private'>Private</span>
                                    ) : (
                                        <span className='private'>Public</span>
                                    )}

                                </div>
                            </div>
                        </ul>
                    </NavLink>
                </div>
            ))}

        </>
    )
}

export default Groups;
