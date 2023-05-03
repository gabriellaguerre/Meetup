import React from 'react'
// import {Link, useParams, Redirect} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {useState} from 'react'
// import Groups from './index'

function CreateGroup() {
   // const dispatch = useDispatch()

    const user = useSelector(state => state.session.user)

    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [about, setAbout] = useState('')
    const [type, setType] = useState('')
    const [privatePublic, setPrivatePublic] = useState('')
    const [url, setUrl] = useState('')

    return (
        <form>
        <h3>BECOME AN ORGANIZER</h3>
        <h2>We'll walk you through a few steps to build your local community</h2>
        <h2>First, set your group's location</h2>
        <p>Meetup groups meet locally, in person and online.  We'll connect you with people in your area, and more can you online</p>
        <input placeholder='City,STATE'></input>
        <h3>What will your group's name be?</h3>
        <p>Choose a name that will give people a clear idea of what the group is about.  Feel free to get creative! You can edi this later if you change your mind</p>
        <input placeholder='What is your group name?'></input>
        <h3>Now describe what your group will be about</h3>
        <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
        <ul>1. What's the purpose of the group?</ul>
        <ul>2. Who should join?</ul>
        <ul>3. What will you do at your events?</ul>
        <textarea placeholder='Please write at least 30 characters'></textarea>
        <h3>Final steps...</h3>
        <p>Is this an in person or online group?</p>
        <select>
            <option value='' disabled>(select one)</option>
            <option>In Person</option>
            <option>Online Group</option>
        </select>
        <p>Is this group private or public?</p>
        <select>
            <option value='' disabled>(select one)</option>
            <option>Private</option>
            <option>Public</option>
        </select>
        <p>Please add an image url for your group below</p>
        <input placeholder='Image Url'></input>
        <p>
        <button>Create group</button>
        </p>
        </form>
    )
}

export default CreateGroup;
