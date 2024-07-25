import axios from 'axios';

// Action Types
export const FETCH_USER_DETAILS_SUCCESS = 'FETCH_USER_DETAILS_SUCCESS';
export const UPDATE_USER_DETAILS_SUCCESS = 'UPDATE_USER_DETAILS_SUCCESS';
export const USER_DETAILS_ERROR = 'USER_DETAILS_ERROR';

// Action Creators
export const fetchUserDetails = (userId) => async (dispatch) => {
    try {
        const response = await axios.get(`/api/userDetails/${userId}`);
        dispatch({ type: FETCH_USER_DETAILS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: USER_DETAILS_ERROR, payload: error.message });
    }
};

export const updateUserDetails = (userId, updatedDetails) => async (dispatch) => {
    try {
        const response = await axios.put(`/api/userDetails/${userId}`, updatedDetails);
        dispatch({ type: UPDATE_USER_DETAILS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: USER_DETAILS_ERROR, payload: error.message });
    }
};
