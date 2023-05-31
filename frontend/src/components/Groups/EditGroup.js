import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import * as sessionGroup from '../../store/group'
import './EditGroup.css'


function EditGroup() {

    const {groupId} = useParams()
    const user = useSelector(state => state.session.user)
    const group = useSelector(state => state.group[groupId])
    const dispatch = useDispatch()
    const history = useHistory()

    const [oneLocation, setOneLocation] = useState([group.city, group.state].join(', '))
    const [name, setName] = useState(group.name)
    const [about, setAbout] = useState(group.about)
    const [type, setType] = useState(group.type)
    const [privatePublic, setPrivatePublic] = useState(group.privatePublic)
    const [url, setUrl] = useState(group.groupImg)
    const [errors, setErrors] = useState({})
    const [hasFilledEdit, setHasFilledEdit] = useState(false)
    const [editLocationBackground, setEditLocationBackground] = useState('blueFields')
    const [editNameBackground, setEditNameBackground] = useState('blueFields')
    const [editAboutBackground, setEditAboutBackground] = useState('blueFields')
    const [editTypeBackground, setEditTypeBackground] = useState('blueFields')
    const [editPrivateBackground, setEditPrivateBackground] = useState('useFields')
    const [editUrlBackground, setEditUrlBackground] = useState('blueFields')

    const [disable, setDisable] = useState(true)


    useEffect(() => {

        let validationErrors = {}

    if (oneLocation?.length === 0 && hasFilledEdit) {
        validationErrors.oneLocation = "*City and State are required. Use a comma (,) to separate them."
        setEditLocationBackground('blueFields')
    } else {
        setEditLocationBackground('whiteFields')
    }

    if (name?.length === 0 && hasFilledEdit) {
        validationErrors.name = "*Name is required"
        setEditNameBackground('blueFields')
    } else {
        setEditNameBackground('whiteFields')
    }

    if (about?.length === 0 && hasFilledEdit) {
        validationErrors.about = "*An event description is required"
        setEditAboutBackground('blueFields')
    } else {
        setEditAboutBackground('whiteFields')
    }

    if (type?.length === 0 && hasFilledEdit) {
        validationErrors.type = "*Choose between Online or In Person"
        setEditTypeBackground('blueFields')
    } else {
        setEditTypeBackground('whiteFields')
    }

    if (privatePublic?.length === 0 && hasFilledEdit) {
        validationErrors.privatePublic = "*Choose between Private or Public"
        setEditPrivateBackground('blueFields')
    } else {
        setEditPrivateBackground('whiteFields')
    }

    if(url?.length === 0 && hasFilledEdit) {
        validationErrors.url = "*Image is required"
        setEditUrlBackground('blueFields')
    } else {
        setEditUrlBackground('whiteFields')
    }

    if(validationErrors) {
        setDisable(true)
        setErrors(validationErrors)
    } else {
        setErrors({})
        setDisable(false)
    }

}, [hasFilledEdit, oneLocation, name, about, type, privatePublic, url])

        // if (oneLocation?.length === 0 || name?.length === 0 || about?.length === 0 || type?.length === 0 || url?.length === 0) {
        //     setDisable(true)
        // } else {
        //     setDisable(false)
        // }

   // }, [oneLocation, name, about, type, privatePublic, url])

    ////////////////////////////////////////////////////////////////

    if (user === null) {
        return history.push('/')
    }

let boolVal
    const handleUpdate = (e) => {
        e.preventDefault()
        setDisable(false)

        const form = {
            oneLocation,
            name,
            about,
            type,
            privatePublic,
            url
        }

        const newLocation = oneLocation.split(',')
        if(privatePublic) {
             boolVal = JSON.parse(privatePublic)
        } else {
             boolVal = true
        }


        const form2 = {
            city: newLocation[0],
            state: newLocation[1],
            name,
            about,
            type,
            private: boolVal,
            groupImg: url
        }

        return dispatch(sessionGroup.editingGroup(form2, groupId))
            .then(() => history.push(`/groups/${groupId}`))
            .catch(async (res) => {
                const data = await res.json()
                if (data && data.errors) {
                    setErrors(data.errors)
                    setDisable(true)
                }
            })
    }

    return (
        <form onSubmit={handleUpdate}>

        <div className='editgroupGridContainer'>
            <h1>Edit Group {group.name}</h1>
            <h2>We'll walk you through a few steps to build your local community</h2>
            <div id='edittitle3'>First, set your group's location.</div>
            <div id='edittitle4'>Meetup groups meet locally, in person and online.  We'll connect you with people in your area, and more can you online</div>
            <input id='editlocationAnswer' className={editLocationBackground}
                placeholder='City,STATE'
                type='text'
                value={oneLocation}
                onChange={(e) => setOneLocation(e.target.value)}
                onClick={()=> {setHasFilledEdit(true); setEditLocationBackground('whiteFields')}}/>
            <div className='errorLocation'>
                 {errors.oneLocation && (<p>{errors.oneLocation}</p>)}
            </div>


            <h3 id='editgroupName'>What will your group's name be?</h3>
            <p id='groupNameText'>Choose a name that will give people a clear idea of what the group is about.  Feel free to get creative! You can edi this later if you change your mind</p>
            <input id='editgroupNameAnswer' className={editNameBackground}
                placeholder='What is your group name?'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                onClick={()=> {setHasFilledEdit(true); setEditNameBackground('whiteFields')}} />
            <div className='errorGroupName'>
                {errors.name && (<p>{errors.name}</p>)}
            </div>

            <div id='editgroupDescriptionBox'>
            <h3 id='editgroupDescription1'>Now describe what your group will be about</h3>
            <p id='editgroupDescription2'>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
            <ul>1. What's the purpose of the group?</ul>
            <ul>2. Who should join?</ul>
            <ul>3. What will you do at your events?</ul>
            </div>
            <textarea id='editgroupDescriptionAnswer' className={editAboutBackground}
                placeholder='Please write at least 50 characters'
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                onClick={()=> {setHasFilledEdit(true); setEditAboutBackground('whiteFields')}}/>
            <div className='errorAbout'>
                {errors.about && (<p>{errors.about}</p>)}
            </div>

            <h3 id='editfinalSteps'>Final steps...</h3>
            <div id='groupType'>Is this an in person or online group?</div>
            <select className={editTypeBackground} id='editgroupTypeAnswer' value={type} onChange={(e) => setType(e.target.value)}>
                <option value='' disabled>(select one)</option>
                <option>In Person</option>
                <option>Online</option>
            </select>
            <div className='errorTypePerson'>
                {errors.type && (<p>{errors.type}</p>)}
            </div>


            <div id='editprivatePub'>Is this group private or public?</div>
            <select className={editPrivateBackground} id='editprivatePubAnswer' value={privatePublic} onChange={(e) => setPrivatePublic(e.target.value)}>
                <option value='' disabled>(select one)</option>
                <option value='true'>Private</option>
                <option value='false'>Public</option>
            </select>
            <div className='errorPrivatePublic'>
                {errors.private && (<p>{errors.private}</p>)}
            </div>

            <div id='editgroupImgUrl'>Please add an image url for your group below</div>
            <input className={editUrlBackground} id='editgroupImgUrlAnswer'
                placeholder='Image Url'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onClick={()=> {setHasFilledEdit(true); setEditUrlBackground('whiteFields')}} />
             <div className='errorImageUrl'>
                {errors.url && (<p>{errors.url}</p>)}
            </div>

            <button id='editUpdate' disabled={disable} onSubmit={handleUpdate} >Update Group</button>
            <button id='editCancel' onClick={() => history.push(`/groups/${group.id}`)}>Cancel</button>

            </div>
        </form>
    )
 }

export default EditGroup;







//   const { groupId } = useParams();
//   const group = useSelector((state) => state.group[groupId])

//   let oneLocation;
//   let group1;

//   if(group) {

//     oneLocation = [group.city, group.state]
//     group1 = {
//     groupId: group.id,
//     oneLocation,
//     name: group.name,
//     about: group.about,
//     type: group.type,
//     privatePublic: group.private,
//     url: group.previewImage
//   }
//   }

//   return (
//     <>
//     {group &&
//     <GroupForm group={group1} formType="Update Group" />
//     }
//     </>
//   );
// }

// export default EditGroupForm;
