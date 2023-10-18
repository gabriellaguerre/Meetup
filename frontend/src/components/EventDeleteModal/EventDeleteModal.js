import React from 'react'
//import * as sessionGroup from '../../store/group'
import * as sessionEvent from '../../store/event'
import * as groupActions from '../../store/group'
import { useDispatch, useSelector} from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useModal } from '../../context/Modal'
//import OpenModalButton from '../OpenModalButton';
import './eventDeleteModal.css'

function EventDeleteModal({eventId, groupId}) {

    const group = useSelector(state => state.group[groupId])
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();


    const removeEvent = (eventId) => {
        dispatch(sessionEvent.eventRemover(eventId))
        .then(dispatch(sessionEvent.fetchEvents()))
        .then(dispatch(groupActions.fetchGroups()))
        .then(history.push(`/groups/${group.id}`))

    }


    return (
        <>

                <div id='modal-background'>
                    <div className="modalContainer1">
                        <div className='titleCloseButton1'>
                            <button onClick={closeModal}>X</button>
                        </div>
                        <div className='title'>Confirm Delete</div>

                        <div className='body'>
                            <div>Are you sure you want to remove this event?</div>
                        </div>
                        <div className='footer'>
                            <button id='yesButton' onClick={() => removeEvent(eventId)}>Yes (Delete Event)</button>
                            <button id='noButton' onClick={closeModal}>No (Keep Event)</button>
                        </div>
                    </div>
                </div>






        </>
    )
}
export default EventDeleteModal;
