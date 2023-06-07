import React from 'react'
import * as sessionGroup from '../../store/group'
import { useDispatch} from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useModal } from '../../context/Modal'
import './index.css'

function DeleteModal({ groupId}) {

    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();


    const confirmDelete = (groupId) => {
        dispatch(sessionGroup.groupRemover(groupId))
            .then(history.push('/groups'))
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
                            <div>Are you sure you want to remove this group?</div>
                        </div>
                        <div className='footer'>
                            <button id='yesButton' onClick={() => confirmDelete(groupId)}>Yes (Delete Group)</button>
                            <button id='noButton' onClick={closeModal}>No (Keep Group)</button>
                        </div>
                    </div>
                </div>
        </>
    )
}
export default DeleteModal;
