import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import * as groupActions from '../../store/group'
// import GroupDetail from './GroupDetails'
// import Navigation from '../Navigation'

function Groups() {
    const history = useHistory()
    const dispatch = useDispatch();
    const groupList = useSelector(state => Object.values(state.group))

    const [groupD, setGroupD] = useState(false)

    useEffect(() => {
        dispatch(groupActions.fetchGroups())
    }, [dispatch])



    if(groupD === true) {
        history.push('/groups/:groupId')
    }


    return (
        <>
        <div><Link to='/events'>Events</Link> Groups</div>

        {groupList.map(group => (
            <div>
                <Link to={`/groups/${group.id}`} onClick={() => setGroupD(true)}>
                <ul key={group.id}>
                    <div><img src={group.url} alt='  ' width="50" height="50"/>
                    {group.name}</div></ul>
                {/* <li>Organizer ID: {group.organizerId}</li>
                <li>Name: {group.name}</li>/home/gabriel/appacademy-2022-meetup-project/Meetup/frontend/src/context
                <li>About: {group.about}</li> */}
                </Link>
            </div>
        ))}

        </>
    )
}

export default Groups
