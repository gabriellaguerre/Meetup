import { csrfFetch } from './csrf';

const GET_EVENTS = 'event/getEvents'
const REMOVE_EVENT = 'event/removeEvent'
const CREATE_EVENT = 'event/createEvent'
const FIND_EVENT_GROUP = 'event/findEventGroup'
const UPDATE_EVENT = 'event/updateEvent'

const findEvent = (data) => {
    return {
        type: FIND_EVENT_GROUP,
        data
    }
}

const loadEvents = (data) => {
    return {
        type: GET_EVENTS,
        data
    }
}

const removeEVent = (eventId) => {
    return {
        type: REMOVE_EVENT,
        eventId
    }
}

const createEvent = (event) => {
    return {
        type: CREATE_EVENT,
        event
    }
}

const updateEvent = (eventId) => {
    return {
        type: UPDATE_EVENT,
        eventId
    }
}
export const findEvents = (eventId) => async () => {
    const response = await fetch(`/api/events/${eventId}/`)

    if(response.ok) {
        const data = await response.json()
        //dispatch(findEvent(data))
        return data
    }
}

export const fetchEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events')

    if (response.ok) {
        const data = await response.json()
        dispatch(loadEvents(data))
        return data
    }
}

export const creatingEvent = (payload, groupId) => async (dispatch) => {
    console.log("INSIDE CREATE THUNK LINE 57")
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    if(response.ok) {
        const data = await response.json()
        console.log(data, "INSIDE DATA LINE 65")
        dispatch(createEvent(data))
        return data
    }
}

export const updatingEvent = (payload, eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    if(response.ok) {
        const data = await response.json()
        dispatch(updateEvent(data))
    }
}

export const eventRemover = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE'
    })
    if(response.ok) {
        dispatch(removeEVent(eventId))
    }
}


const eventReducer = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case GET_EVENTS:
            newState = {}
            action.data.Events.map((Event) => newState[Event.id] = Event)
            return newState
        case FIND_EVENT_GROUP:
            newState={}
            return newState[action.data];
        case CREATE_EVENT:
            newState = { ...state, [action.event.id]: action.event }
            return newState
        case UPDATE_EVENT:
            newState = {...state, [action.event.id]: action.event}
        case REMOVE_EVENT:
            newState = {...state}
            delete newState[action.eventId]
            return newState
        default:
            return state;
    }
};
export default eventReducer
