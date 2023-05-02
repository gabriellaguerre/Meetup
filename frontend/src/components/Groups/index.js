import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useState} from 'react'
import {Link, Route} from 'react-router-dom'
import * as groupActions from '../../store/group'
import GroupDetail from './GroupDetails'
import Navigation from '../Navigation'

function Groups() {
    const dispatch = useDispatch();
    const groupList = useSelector(state => Object.values(state.group))

    const [groupD, setGroupD] = useState(false)

    useEffect(() => {
        dispatch(groupActions.fetchGroups())
    }, [dispatch])



    if(groupD === true) {
        return (
            <>
            <Navigation />
            <GroupDetail />
            </>
            )
    }


    return (
        <>
        <h1>Groups</h1>
        {groupList.map(group => (
            <div>
                <Link to={`/groups/${group.id}`} onClick={() => setGroupD(true)}>
                <li key={group.id}>{group.name}</li>
                {/* <li>Organizer ID: {group.organizerId}</li>
                <li>Name: {group.name}</li>
                <li>About: {group.about}</li> */}
                </Link>
            </div>
        ))}

        </>
    )
}

export default Groups
