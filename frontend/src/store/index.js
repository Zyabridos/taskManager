import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import statusesReducer from './slices/statusesSlice';
import labelsReducer from './slices/labelsSlice';
import tasksReducer from './slices/tasksSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
    statuses: statusesReducer,
    labels: labelsReducer,
    tasks: tasksReducer,
  },
});

export default store;
