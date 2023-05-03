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

const createGroup = () => {
    return {
        type: CREATE_GROUP
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

const groupReducer = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case GET_GROUPS:
            newState = {}
            action.data.Groups.map((Group) => newState[Group.id] = Group)
            return newState;
        case REMOVE_GROUP:
            newState = Object.assign({}, state);
            newState.user = null;
            return newState;
        default:
            return state;
    }
};
export default groupReducer
