import React, { useState, useEffect, useRef } from 'react'
import * as sessionGroup from '../../store/group'
import { useDispatch, useSelector, } from 'react-redux'
import {useHistory} from 'react-router-dom'
import { useModal } from '../../context/Modal'
import OpenModalButton from '../OpenModalButton';
import './index.css'

function DeleteModal({ groupId }) {
    console.log(groupId, "IN DELETE MODAL")

    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();



    const confirmDelete = (groupId) => {
        return dispatch(sessionGroup.groupRemover(groupId))
        .then(history.push('/groups'))
    }


    return (
        <>

            <div className='modalBackground1'>
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
