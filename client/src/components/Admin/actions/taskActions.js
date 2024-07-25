// src/actions/taskActions.js
import axios from 'axios';
import {
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_FAILURE
} from './actionTypes';

export const createTask = (taskData) => async (dispatch) => {
  dispatch({ type: CREATE_TASK_REQUEST });
  try {
    const response = await axios.post('/api/tasks', taskData);
    dispatch({ type: CREATE_TASK_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("Error creating task:", error.response?.data?.error || error.message);
    dispatch({ type: CREATE_TASK_FAILURE, payload: error.response?.data?.error || 'Server error' });
  }
};
