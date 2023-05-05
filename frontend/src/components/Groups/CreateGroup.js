import GroupForm from './GroupForm';


function CreateGroup() {

        const group = {
            oneLocation: '',
            name: '',
            about: '',
            type: '',
            private: '',
            url: ''
        }


    return (
        <GroupForm group={group} formType="Create Group" />
    )

}

export default CreateGroup;
