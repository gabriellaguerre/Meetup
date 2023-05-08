import { Link, useParams, Route, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as sessionGroup from '../../store/group'
import { useEffect } from 'react'
import Groups from './index'
import EditGroupForm from './EditGroup'
import CreateEvent from '../Events/CreateEvent'
import './groupDetail.css'

function GroupDetail() {
    const { groupId } = useParams();
    const dispatch = useDispatch()
    const history = useHistory()

    const group = useSelector(state => state.group[groupId])

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
        <>      <div className='backLink'><Link to='/groups'> Groups</Link></div>
                <div className='topContainer'>
                <span className='groupImage'><img src='' alt='' width='200' height='200' /></span>
                <span className='name'>{group.name}
                <div className='location'>{group.city}, {group.state}</div>
                <div>
                <span className='events'># events</span>
                <span className='public'>public</span>
                </div>
                <div className='organizer'>Organized by: {group.organizerId}</div>
                <button className='joinButton'>Join This Group</button>
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

                {/* <div>
                <button onClick={() => createEvent(group)}>Create Event</button>
                <button onClick={() => EditGroup()}>Update</button>
                <button type='submit' onClick={removeGroup}>Delete</button>
                <button onClick={() => history.push('/groups')}>back</button> */}
        </>
    )
}

export default GroupDetail;
