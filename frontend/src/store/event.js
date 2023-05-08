import { csrfFetch } from './csrf';

const GET_EVENTS = 'event/getEvents'
const REMOVE_EVENT = 'event/removeEvent'
const CREATE_EVENT = 'event/createEvent'
const FIND_EVENT_GROUP = 'event/findEventGroup'

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

export const findEvents = (groupId) => async () => {
    const response = await fetch(`/api/groups/${groupId}/events`)

    if(response.ok) {
        const data = await response.json()
        const numEvents = data.Events.length
        console.log(numEvents, "IN THUNK FIND EVENTS")
       // dispatch(findEvent(numEvents))
        return numEvents
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
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    if(response.ok) {
        const data = await response.json()
        dispatch(createEvent(data))
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
            newState = {...state}
            return newState;
        case CREATE_EVENT:
            newState = { ...state, [action.event.id]: action.event }
            return newState
        case REMOVE_EVENT:
            newState = {...state}
            delete newState[action.eventId]
            return newState
        default:
            return state;
    }
};
export default eventReducer
