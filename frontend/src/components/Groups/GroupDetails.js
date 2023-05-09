import { Link, useParams, Route, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as sessionGroup from '../../store/group'
import { useEffect, useState } from 'react'
import Groups from './index'
import EditGroupForm from './EditGroup'
import CreateEvent from '../Events/CreateEvent'
import './groupDetail.css'

function GroupDetail() {
    const { groupId } = useParams();
    const dispatch = useDispatch()
    const history = useHistory()

    const group = useSelector(state => state.group[groupId])
    const user = useSelector(state => state.session.user)

    const [theUser, setTheUser] = useState(false)

    console.log(user, "USER IN GROUPDETAIL")

    useEffect(()=> {
        if(!user) {
            setTheUser(false)
        }
        if(user && user.id === group.organizerId) {
            setTheUser(true)
        }

    },[user])

    const removeGroup = (e) => {
        e.preventDefault()
        dispatch(sessionGroup.groupRemover(groupId))
        history.push('/groups')
    }

    const EditGroup = () => {
        history.push(`/groups/${group.id}/edit`)
    }

    const createEvent = () => {
        history.push(`/groups/${group.id}/events/new`)
        return (
            <>
                <CreateEvent groupId={group.id} />
            </>
        )
    }



    return (
        <>
            <div className='backLink'><Link to='/groups'> Groups</Link></div>
            <div className='topContainer'>
                <span className='groupImage'><img src='' alt='' width='200' height='200' /></span>
                <span className='name'>{group.name}
                    <div className='location'>{group.city}, {group.state}</div>
                    <div>
                        <span className='events'># events</span>
                        <span className='public'>public</span>
                    </div>
                    <div className='organizer'>Organized by: {group.organizerId}</div>

                    <div>
                        {theUser ? (
                            <>
                                <button onClick={() => createEvent(group)}>Create Event</button>
                                <button onClick={() => EditGroup()}>Update</button>
                                <button type='submit' onClick={removeGroup}>Delete</button>
                                <button onClick={() => history.push('/groups')}>back</button>
                            </>
                        ) : (
                            <button className='joinButton'>Join This Group</button>
                        )}
                    </div>
                </span>
            </div>

            <div className='bottomContainer'>
                <div className='organizer'> Organizer </div>
                <div className='name'>{group.organizerId}</div>
                <div className='about'>What We're About:</div>
                <div className='description'>{group.about}</div>
                <div className='upcomingEvents'>Upcoming Events</div>
                <div className='pastEvents'>Past Events</div>
            </div>


        </>
    )
}

export default GroupDetail;
