import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import statusesReducer from './slices/statusesSlice';
import labelsReducer from './slices/labelsSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
    statuses: statusesReducer,
    labels: labelsReducer,
  },
});

export default store;
