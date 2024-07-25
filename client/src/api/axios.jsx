import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
});

// Add a request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = (authData) => API.post('/login',authData)
export const getUserProjects = (user_id) => API.get(`/api/userDetails/${user_id}/projects`)
export const getUserTasks = (user_id, project_id) => API.get(`/api/userDetails/${user_id}/project/${project_id}/tasks`)