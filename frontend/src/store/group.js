import { csrfFetch } from './csrf';

const GET_USERS = 'group/getUsers'
const GET_GROUPS = 'group/getGroups'
const REMOVE_GROUP = 'group/removeGroup'
const CREATE_GROUP = 'group/createGroup'
const UPDATE_GROUP = 'group/updateGroup'

const loadUsers = (data) => {
    return {
        type: GET_USERS,
        data
    }
}


const loadGroups = (data) => {
    return {
        type: GET_GROUPS,
        data
    }
}

const removeGroup = (groupId) => {
    return {
        type: REMOVE_GROUP,
        groupId
    }
}

const createGroup = (group) => {
    return {
        type: CREATE_GROUP,
        group
    }
}

const editGroup = (group) => {
    return {
        type: UPDATE_GROUP,
        group
    }
}

export const fetchUsers = () => async (dispatch) => {
    const response = await csrfFetch('/api/users')

    if(response.ok) {
        const data = await response.json()
        dispatch(loadUsers(data))
        return data
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

    const response = await csrfFetch('/api/groups', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    if(response.ok) {
        const data = await response.json()
      
        dispatch(createGroup(data))
        return data
    }
}

export const editingGroup = (payload, id) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    if(response.ok) {
        const data = await response.json()
        dispatch(editGroup(data))
    }
}

export const groupRemover = (groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
    })

    dispatch(removeGroup(groupId))
    return response
}

const groupReducer = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case GET_USERS:
            newState = {}
            action.data.Users.map((User) => newState[User.id] = User)
            return newState;
        case GET_GROUPS:
            newState = {}
            action.data.Groups.map((Group) => newState[Group.id] = Group)
            return newState;
        case CREATE_GROUP:
            newState = {...state, [action.group.id]: action.group}
            return newState
        case UPDATE_GROUP:
            newState = {...state, [action.group.id]: action.group}
            return newState
        case REMOVE_GROUP:
            newState = {...state}
            delete newState[action.groupId]
            return newState
        default:
            return state;
    }
};
export default groupReducer
