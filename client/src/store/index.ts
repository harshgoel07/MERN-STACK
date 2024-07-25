import { AnyAction, ThunkDispatch, configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer'; // Adjust the import path as needed

// Load state from localStorage
const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load state', err);
    return undefined;
  }
};

// Save state to localStorage
const saveStateToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

// Initialize the store with the loaded state
const preloadedState = loadStateFromLocalStorage();

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

// Subscribe to store updates to save state
store.subscribe(() => {
  saveStateToLocalStorage(store.getState());
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type TypedDispatch<T> = ThunkDispatch<T, any, AnyAction>;

export default store;