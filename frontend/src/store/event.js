import { csrfFetch } from './csrf';

const GET_EVENTS = 'event/getEvents'
const REMOVE_EVENT = 'event/removeEvent'
const CREATE_EVENT = 'event/createEvent'

const loadEvents = (data) => {
    return {
        type: GET_EVENTS,
        data
    }
}

const removeEVent = () => {
    return {
        type: REMOVE_EVENT
    }
}

const createGroup = () => {
    return {
        type: CREATE_EVENT
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

const eventReducer = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case GET_EVENTS:
            newState = {}
            action.data.Events.map((Event) => newState[Event.id] = Event)
            return newState;
        case REMOVE_EVENT:
            newState = Object.assign({}, state);
            newState.user = null;
            return newState;
        default:
            return state;
    }
};
export default eventReducer
