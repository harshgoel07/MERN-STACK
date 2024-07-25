// authAction.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import * as api from '../api/axios';
import { logout } from '../store/userSlice';



export const loginUser = createAsyncThunk('user/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.login(userData);
    const token = response.data.token;
    sessionStorage.setItem('token', token);
    console.log(response.data.error)
    if(response.data.error === "No user found"){
      toast.error(response.data.error)
    } else if(response.data.error === "Wrong Password"){
      toast.error(response.data.error)
    }else{
    toast.success("Login successful");
    }

    // alert(`${response.data}`);


    return response.data; // Assuming response.data contains user object
  } catch (error) {
    // toast.error(error.response.data.message);
    console.log(error.response.data.message)
    return rejectWithValue(error.response.data.message);
  }
});

export const logoutUser = () => (dispatch) => {
  sessionStorage.removeItem('token');
  localStorage.removeItem('reduxState')
  dispatch(logout());
};