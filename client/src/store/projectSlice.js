import { createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projects: [],
  },
  reducers: {
    setProjects(state, action) {
      state.projects = action.payload;
    },
    addProject(state, action) {
      state.projects.push(action.payload);
    },
    updateProject(state, action) {
      const index = state.projects.findIndex(p => p._id === action.payload._id);
      state.projects[index] = action.payload;
    },
    deleteProject(state, action) {
      state.projects = state.projects.filter(p => p._id !== action.payload);
    },
  },
});

export const { setProjects, addProject, updateProject, deleteProject } = projectSlice.actions;
export default projectSlice.reducer;
