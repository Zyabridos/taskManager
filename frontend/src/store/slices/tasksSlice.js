import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tasksApi } from '../../api/tasksApi';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  return await tasksApi.getAll();
});

export const deleteTaskThunk = createAsyncThunk('tasks/deleteTask', async id => {
  await tasksApi.remove(id);
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(task => task.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
