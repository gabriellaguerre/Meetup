import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import * as sessionGroup from '../../store/group'
import './CreateGroup.css'

function CreateGroup() {

    const user = useSelector(state => state.session.user)
    const theGroup = useSelector(state => Object.values(state.group))
    const dispatch = useDispatch()
    const history = useHistory()


    const [oneLocation, setOneLocation] = useState('')
    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
    const [type, setType] = useState('')
    const [privatePublic, setPrivatePublic] = useState('')
    const [url, setUrl] = useState('')
    const [errors, setErrors] = useState({})
    const [goToPage, setGoToPage] = useState(false)
    const [hasFilled, setHasFilled] = useState(false)
  //  const [whichButton, setWhichButton] = useState('groupNoCreate')
    // const [locationBackground, setLocationBackground] = useState('blueFields')
    // const [nameGroupBackground, setNameGroupBackground] = useState('blueFields')
    // const [aboutBackground, setAboutBackground] = useState('blueFields')
    // const [groupTypeBackground, setGroupTypeBackground] = useState('blueFields')
    // const [privatePBackground, setPrivatePBackground] = useState('blueFields')
    // const [imageUrlBackground, setImageUrlBackground] = useState('blueFields')


////////////////////////////////////ORIGINAL////////////////////////////////////////////////
    // useEffect(() => {
    //     console.log(disable, "DISABLE LINE 37")
    //     if (oneLocation.length > 0 && name.length > 0 && about.length > 0  && type.length > 0 && privatePublic.length > 0 && url.length > 0) {
    //         setDisable(false)
    //         console.log(disable, "USE EFFECT LINE 39")
    //     }

    // }, [disable, oneLocation, name, about, type, privatePublic, url])
//////////////////////////////////MODIFFIED VERSION////////////////////////////////////////
useEffect(() => {
    let validationErrors = {}

    if (oneLocation.length === 0 && hasFilled) {
        validationErrors.oneLocation = "*City and State are required. Use a comma (,) to separate them."
      //  setLocationBackground('blueFields')
    }

    if (name.length === 0 && hasFilled) {
        validationErrors.name = "*Name is required"
      //  setNameGroupBackground('blueFields')
    }

    if (about.length === 0 && hasFilled) {
        validationErrors.about = "*An event description is required"
      //  setAboutBackground('blueFields')

    }

    if (type.length === 0 && hasFilled) {
        validationErrors.type = "*Choose between Online or In Person"
       // setGroupTypeBackground('blueFields')
    }

    if (privatePublic.length === 0 && hasFilled) {
        validationErrors.privatePublic = "*Choose between Private or Public"
       // setPrivatePBackground('blueFields')
    }

    if(url.length === 0 && hasFilled) {
        validationErrors.url = "*Image is required"
        //setWhichButton('groupCreate')
    }

    if(validationErrors) {
        //setDisable(true)
       // setWhichButton('groupNoCreate')
        setErrors(validationErrors)
      //  console.log(whichButton, "LINE 83")

    } else {
        setErrors({})
     //   setWhichButton('groupCreate')
       // console.log(whichButton, "LINE 88")
        //setDisable(false)
    }

}, [hasFilled, oneLocation, name, about, type, privatePublic, url])

///////////////////////////////////////////////////////////////////////////////////////////////
    if (user === null) {
        return history.push('/groups')
    }

    //console.log(disable, "LINE 94")


    const handleSubmit = (e) => {
//console.log(disable, "IN HANDLE SUBMIT LINE 97")
        e.preventDefault()
        //setDisable(false)
        setErrors({})
        setHasFilled(false)

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
            private: boolVal,
            groupImg: url
        }



        return dispatch(sessionGroup.creatingGroup(form2))
            .then(dispatch(sessionGroup.fetchGroups()))
            .then(() => setGoToPage(true))

            .catch(async (res) => {
                const data = await res.json()
                if (data && data.errors) {
                    setErrors(data.errors)
                    //setDisable(true)
                }
            })
    }



    if (goToPage) {
        history.push(`/groups/${theGroup[theGroup.length - 1].id}`)
    }

    return (
        <form onSubmit={handleSubmit}>

          <div className='groupGridContainer'>
            <h1>Hello {user.firstName}, Start a New Group</h1>
            <h2>We'll walk you through a few steps to build your local community</h2>
            <div id='title3'>First, set your group's location.</div>
            <div id='title4'>Meetup groups meet locally, in person and online.  We'll connect you with people in your area, and more can you online</div>
            <input id='locationAnswer'
                placeholder='City,STATE'
                type='text'
                value={oneLocation}
                onChange={(e) => setOneLocation(e.target.value)}
                onClick={()=> {setHasFilled(true)}}/>
            <div className='errorLocation'>
                {errors.oneLocation && (<p>{errors.oneLocation}</p>)}
            </div>

            <h3 id='groupName'>What will your group's name be?</h3>
            <p id='groupNameText'>Choose a name that will give people a clear idea of what the group is about.  Feel free to get creative! You can edi this later if you change your mind</p>
            <input id='groupNameAnswer'
                placeholder='What is your group name?'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                onClick={()=> {setHasFilled(true)}} />
            <div className='errorGroupName'>
                {errors.name && (<p>{errors.name}</p>)}
            </div>

            <div id='groupDescriptionBox'>
            <h3 id='groupDescription1'>Now describe what your group will be about</h3>
            <p id='groupDescription2'>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
            <ul id='ul1'>1. What's the purpose of the group?</ul>
            <ul id='ul2'>2. Who should join?</ul>
            <ul id='ul3'>3. What will you do at your events?</ul>
            </div>
            <textarea id='groupDescriptionAnswer'
                placeholder='    Please write at least 50 characters'
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                onClick={()=> {setHasFilled(true)}} />
            <div className='errorAbout'>
                {errors.about && (<p>{errors.about}</p>)}
            </div>


            <h3 id='finalSteps'>Final steps...</h3>
            <div id='groupType'>Is this an In Person or Online group?</div>
            <select  id='groupTypeAnswer' value={type} onChange={(e) => setType(e.target.value)}
            onClick={()=> {setHasFilled(true)}}>
                <option value='' disabled>(select one)</option>
                <option>In Person</option>
                <option>Online</option>
            </select>
            <div className='errorTypePerson'>
                {errors.type && (<p>{errors.type}</p>)}
            </div>

            <div id='privatePub'>Is this group private or public?</div>
            <select  id='privatePubAnswer' value={privatePublic} onChange={(e) => setPrivatePublic(e.target.value)}
            onClick={()=> {setHasFilled(true)}}>
                <option value='' disabled>(select one)</option>
                <option value='true'>Private</option>
                <option value='false'>Public</option>
            </select>
            <div className='errorPrivatePublic'>
                {errors.privatePublic && (<p>{errors.privatePublic}</p>)}
            </div>

            <div id='groupImgUrl'>Please add an image url for your group below</div>
            <input  id='groupImgUrlAnswer'
                placeholder='Image Url'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onClick={()=> {setHasFilled(true)}} />
            <div className='errorImageUrl'>
                {errors.url && (<p>{errors.url}</p>)}
            </div>
            {oneLocation.length === 0 || name.length === 0 || about.length === 0 || type.length === 0 || privatePublic.length === 0 || url.length === 0 ? (
                <button id='groupNoCreate' type='submit' disabled={true}>Create Group</button>
            ) : (
                <button id='groupCreate' type='submit' disabled={false}>Create Group</button>
            )}
            {/* <button id={whichButton} type='submit' disabled={oneLocation.length === 0 || name.length === 0 || about.length === 0 || type.length === 0 || privatePublic.length === 0 || url.length === 0}>Create Group</button> */}
            <button id='groupCancel' onClick={() => history.push('/groups')}>Cancel</button>

         </div>
        </form>
    )
}

export default CreateGroup;
