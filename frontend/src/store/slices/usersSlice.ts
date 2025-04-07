import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { usersApi } from '../../api/usersApi';

export interface User {
  id: number;
  name: string;
}

interface UsersState {
  list: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UsersState = {
  list: [],
  status: 'idle',
  error: null,
};


export const fetchUsers = createAsyncThunk<User[]>(
  'users/fetchUsers',
  async () => {
    return await usersApi.getAll();
  }
);

export const deleteUserThunk = createAsyncThunk<number, number, { rejectValue: string }>(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      await usersApi.remove(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete user');
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(deleteUserThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.list = state.list.filter(status => status.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
