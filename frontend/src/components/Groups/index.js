import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react'
import * as groupActions from '../../store/group'
//import Navigation from '../Navigation'

function Groups() {
    const dispatch = useDispatch();
    const groupList = useSelector(state => Object.values(state.group))

    useEffect(() => {
        dispatch(groupActions.fetchGroups())
    }, [dispatch])

    return (
        <>
        <h1>Groups</h1>
        {groupList.map(group => (
            <div>
                <li key={group.id}>Group ID: {group.id}</li>
                <li>Organizer ID: {group.organizerId}</li>
                <li>Name: {group.name}</li>
                <li>About: {group.about}</li>
            </div>
        ))}
        </>
    )
}

export default Groups
