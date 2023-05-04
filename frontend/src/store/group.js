import { csrfFetch } from './csrf';

const GET_GROUPS = 'group/getGroups'
const REMOVE_GROUP = 'group/removeGroup'
const CREATE_GROUP = 'group/createGroup'

const loadGroups = (data) => {
    return {
        type: GET_GROUPS,
        data
    }
}

const removeGroup = () => {
    return {
        type: REMOVE_GROUP
    }
}

const createGroup = (group) => {
    return {
        type: CREATE_GROUP,
        group
    }
}

export const fetchGroups = () => async (dispatch) => {
    const response = await csrfFetch('/api/groups')

    if (response.ok) {
        const data = await response.json()
        dispatch(loadGroups(data))
        return data
    }

}

export const creatingGroup = (payload) => async (dispatch) => {
    console.log("IN CREATING GROUP THUNK")
    const response = await csrfFetch('/api/groups', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    if(response.ok) {
        const data = await response.json()
        dispatch(createGroup(data))
    }
}

const groupReducer = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case GET_GROUPS:
            newState = {}
            action.data.Groups.map((Group) => newState[Group.id] = Group)
            return newState;
        case CREATE_GROUP:
            newState = {...state, [action.group.id]: action.group}
            return newState
        case REMOVE_GROUP:
            newState = {...state}
            delete newState[action.reportId]
            return newState
        default:
            return state;
    }
};
export default groupReducer
