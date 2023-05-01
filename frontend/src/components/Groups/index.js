import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react'
import * as groupActions from '../../store/group'
import Navigation from '../Navigation'

function Groups() {
    const dispatch = useDispatch();
    const groupList = useSelector(state => Object.values(state.group))

    console.log(groupList, "IN GROUPS COMPONENT")

    useEffect(() => {
        dispatch(groupActions.fetchGroups())
    }, [dispatch])

    return (
        <>
        <Navigation />
        <h1>Groups</h1>
        {groupList.map(group => (
            <li key={group.id}>
                {group}
            </li>
        ))}
        </>
    )
}

export default Groups
