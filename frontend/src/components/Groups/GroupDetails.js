import { Link, useParams, Route, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as sessionGroup from '../../store/group'
import { useEffect } from 'react'
import Groups from './index'
import EditGroupForm from './EditGroup'

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
        console.log("IN EDIT GROUP")
        history.push(`/groups/${group.id}/edit`)
    }


    return (
        <>

            <Link to='/groups'> Groups</Link>
            <p>
                <div><img src='' alt='' width='300' height='300' />Name: {group.name}</div>


                <br /> Organizer:
                {group.organizerId}
                <br />
                What We Are About:
                <p>
                    {group.about}
                </p>
                <br />

                <button>Create Event</button>
                <button onClick={() => EditGroup()}>Update</button>
                <button type='submit' onClick={removeGroup}>Delete</button>
                <button onClick={() => history.push('/groups')}>back</button>
            </p>
        </>
    )
}

export default GroupDetail;
