import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/axios';

export const fetchUserProjects = createAsyncThunk(
    'userDetails/fetchUserProjects',
    async (userId, { rejectWithValue }) => {
      try {
        const response = await api.getUserProjects(userId);
        console.log(response.data)
        return response.data;
      } catch (err) {
          console.log(err)
        return rejectWithValue(err.response.data);
      }
    }
  );
  
  export const fetchUserTasks = createAsyncThunk(
    'userDetails/fetchUserTasks',
    async ({ userId, projectId }, { rejectWithValue }) => {
      try {
        const response = await api.getUserTasks(userId, projectId);
        console.log(response.data)
        return response.data;
      } catch (err) {
          console.log(err)
        return rejectWithValue(err.response.data);
      }
    }
  );