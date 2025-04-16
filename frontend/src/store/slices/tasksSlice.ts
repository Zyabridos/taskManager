import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tasksApi } from '../../api/tasksApi';
import { getErrorMessage } from '../../utils/errorsHandlers';
import { Task, TaskQueryParams } from '../../types/task';

interface TasksState {
  list: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  list: [],
  status: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk<
  Task[],
  TaskQueryParams | undefined,
  { rejectValue: string }
>('tasks/fetchTasks', async (params = {}, thunkAPI) => {
  try {
    return await tasksApi.getAll(params);
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

export const deleteTaskThunk = createAsyncThunk<number, number>('tasks/deleteTask', async id => {
  await tasksApi.remove(id);
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Unknown error';
      })
      .addCase(deleteTaskThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.list = state.list.filter(task => task.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
