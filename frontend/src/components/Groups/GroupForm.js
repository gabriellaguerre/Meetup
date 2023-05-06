import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import * as sessionGroup from '../../store/group'


function GroupForm({ group, formType }) {
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch()
    const history = useHistory()

    const id = group.groupId

    const [oneLocation, setOneLocation] = useState(group.oneLocation)
    const [name, setName] = useState(group.name)
    const [about, setAbout] = useState(group.about)
    const [type, setType] = useState(group.type)
    const [privatePublic, setPrivatePublic] = useState(group.privatePublic)
    const [url, setUrl] = useState(group.url)
    const [errors, setErrors] = useState([])

 //   const [disable, setDisable] = useState(true)

//     useEffect(() => {
//         const error = []
//         if(errors.name) error.push(errors.name)
//         if(errors.about) error.push(errors.about)
//         if(errors.type) error.push(errors.about)
//         if(errors.privatePublic) error.push(errors.privatePublic)
//         if(errors.url) error.push(errors.url)
// console.log(error, "IN USE EFFECT")
//         if(error) {
//             setDisable(true)
//         } else {
//             setDisable(false)
//         }
//     }, [disable])

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([])

        const form = {
            oneLocation,
            name,
            about,
            type,
            privatePublic,
            url
        }
        const newLocation = oneLocation.split(',')
        let boolVal = JSON.parse(privatePublic)

        const form2 = {
            city: newLocation[0],
            state: newLocation[1],
            name,
            about,
            type,
            privatePublic: boolVal,
            url
        }

        return dispatch(sessionGroup.creatingGroup(form2))
               .then(() => history.push('/groups'))
               .catch(async (res) => {
                const data = await res.json()
                if(data && data.errors) {
                    setErrors(data.errors)
                  //  setDisable(true)
                } 

               })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        const form = {
            oneLocation,
            name,
            about,
            type,
            privatePublic,
            url
        }


        const newLocation = oneLocation.split(',')
        let boolVal = JSON.parse(privatePublic)

        const form2 = {
            city: newLocation[0],
            state: newLocation[1],
            name,
            about,
            type,
            privatePublic: boolVal,
            url
        }

       return dispatch(sessionGroup.editingGroup(form2, id))
              .then(() => history.push('/groups'))
              .catch(async (res) => {
                const data = await res.json()
                if(data && data.errors) {
                    setErrors(data.errors)
                   // setDisable(true)
                }
              })
    }


    if (user === null) {
        return (
            <h1>Not Authorized</h1>
        )
    }

    const typeButton = (formType) => {
        if (formType === "Update Group") {

            return (
                <>
                    <button onSubmit={handleUpdate} >Update Group</button>
                    <button onClick={() => history.push('/groups')}>Cancel</button>
                </>
            )
        } else {
            return (
                <>
                    <button onSubmit={handleSubmit}>Create Group</button>
                    <button onClick={() => history.push('/')}>Cancel</button>
                </>
            )
        }
    }


    return (
        <form onSubmit={handleSubmit}>

            <h3>BECOME AN ORGANIZER</h3>
            <h2>We'll walk you through a few steps to build your local community</h2>
            <h2>First, set your group's location</h2>
            <p>Meetup groups meet locally, in person and online.  We'll connect you with people in your area, and more can you online</p>
            <input
                placeholder='City,STATE'
                type='text'
                value={oneLocation}
                onChange={(e) => setOneLocation(e.target.value)} />
            <div className='errors' style={{backgroundColor: 'yellow'}}>
            {errors.city && (<p>{errors.city}</p>)}
            </div>
            <div className='errors' style={{backgroundColor: 'yellow'}}>
            {errors.state && (<p>{errors.state}</p>)}
            </div>


            <h3>What will your group's name be?</h3>
            <p>Choose a name that will give people a clear idea of what the group is about.  Feel free to get creative! You can edi this later if you change your mind</p>
            <input
                placeholder='What is your group name?'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)} />
            <div className='errors' style={{backgroundColor: 'yellow'}}>
            {errors.name && (<p>{errors.name}</p>)}
            </div>

            <h3>Now describe what your group will be about</h3>
            <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
            <ul>1. What's the purpose of the group?</ul>
            <ul>2. Who should join?</ul>
            <ul>3. What will you do at your events?</ul>
            <textarea
                placeholder='Please write at least 50 characters'
                value={about}
                onChange={(e) => setAbout(e.target.value)} />
            <div className='errors' style={{backgroundColor: 'yellow'}}>
            {errors.about && (<p>{errors.about}</p>)}
            </div>

            <h3>Final steps...</h3>
            <p>Is this an in person or online group?</p>
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value='' disabled>(select one)</option>
                <option>In Person</option>
                <option>Online</option>
            </select>
            <div className='errors' style={{backgroundColor: 'yellow'}}>
            {errors.type && (<p>{errors.type}</p>)}
            </div>
            <p>Is this group private or public?</p>
            <select value={privatePublic} onChange={(e) => setPrivatePublic(e.target.value)}>
                <option value='' disabled>(select one)</option>
                <option value='true'>Private</option>
                <option value='false'>Public</option>
            </select>
            <div className='errors' style={{backgroundColor: 'yellow'}}>
            {errors.private && (<p>{errors.private}</p>)}
            </div>

            <p>Please add an image url for your group below</p>
            <input
                placeholder='Image Url'
                value={url}
                onChange={(e) => setUrl(e.target.value)} />
            <p>
                {typeButton(formType)}
            </p>
        </form>
    )
}

export default GroupForm;
