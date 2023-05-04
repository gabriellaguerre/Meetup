import React from 'react'
import {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {useDispatch} from 'react-redux'
import * as sessionGroup from '../../store/group'




function CreateGroup() {
    const user = useSelector(state => state.session.user)

    const dispatch = useDispatch()
    const history = useHistory()

    const [location, setLocation] = useState('')
    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
    const [type, setType] = useState('')
    const [privatePublic, setPrivatePublic] = useState('')
    const [url, setUrl] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        const newLocation = location.split(',')
        let boolVal = JSON.parse(privatePublic)

        const form = {
            city: newLocation[0],
            state: newLocation[1],
            name,
            about,
            type,
            private: boolVal,
            url
        }
        console.log(form, "form")
        dispatch(sessionGroup.creatingGroup(form))

        setLocation('')
        setName('')
        setAbout('')
        setType('')
        setPrivatePublic('')
        setUrl('')
    }

    if(user === null) {
        return(
            <h1>Not Authorized</h1>
        )
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
            value={location}
            onChange={(e) =>  setLocation(e.target.value)} />


        <h3>What will your group's name be?</h3>
        <p>Choose a name that will give people a clear idea of what the group is about.  Feel free to get creative! You can edi this later if you change your mind</p>
        <input
            placeholder='What is your group name?'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)} />

        <h3>Now describe what your group will be about</h3>
        <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
        <ul>1. What's the purpose of the group?</ul>
        <ul>2. Who should join?</ul>
        <ul>3. What will you do at your events?</ul>
        <textarea
            placeholder='Please write at least 30 characters'
            value={about}
            onChange={(e) => setAbout(e.target.value)}/>

        <h3>Final steps...</h3>
        <p>Is this an in person or online group?</p>
        <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value='' disabled>(select one)</option>
            <option>In Person</option>
            <option>Online</option>
        </select>
        <p>Is this group private or public?</p>
        <select value={privatePublic} onChange={(e) => setPrivatePublic(e.target.value)}>
            <option value='' disabled>(select one)</option>
            <option value='true'>Private</option>
            <option value='false'>Public</option>
        </select>
        <p>Please add an image url for your group below</p>
        <input
            placeholder='Image Url'
            value={url}
            onChange={(e) => setUrl(e.target.value)} />
        <p>
        <button>Create group</button>
        </p>
        </form>
    )
}

export default CreateGroup;
