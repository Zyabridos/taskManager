import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers, deleteUser as apiDeleteUser } from '../../api/usersApi';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  return await getUsers();
});

export const deleteUserThunk = createAsyncThunk('users/deleteUser', async id => {
  await apiDeleteUser(id);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(user => user.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
