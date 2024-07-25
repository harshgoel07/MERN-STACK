import { combineReducers } from 'redux';
import userReducer from './userSlice';
import projectReducer from './projectSlice';
import taskReducer from './taskSlice';
import userDetailsReducer from './userDetailsSlice';

const rootReducer = combineReducers({
  user: userReducer,
  project: projectReducer,
  task: taskReducer,
  userDetails: userDetailsReducer
});

export default rootReducer;
