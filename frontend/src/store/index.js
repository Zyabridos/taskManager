import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import statusesReducer from './slices/statusesSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
    statuses: statusesReducer,
  },
});

export default store;
