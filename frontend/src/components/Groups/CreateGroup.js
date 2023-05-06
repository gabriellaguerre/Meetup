import {useState} from 'react'
import GroupForm from './GroupForm';


function CreateGroup() {

        const group = {
            oneLocation: '',
            name:'',
            about: '',
            type: '',
            privatePublic: '',
            url: ''
        }


    return (
        <GroupForm group={group} formType="Create Group" />
    )

}

export default CreateGroup;
