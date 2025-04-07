import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tasksApi } from '../../api/tasksApi';

export interface Task {
  id: number;
  name: string;
  description?: string;
  statusId: number;
  executorId?: number;
  createdAt: string;
  updatedAt?: string;
}

// for example: ?status=1&executor=1&label=1
export type TaskQueryParams = {
  status?: number;
  executor?: number;
  label?: number;
  [key: string]: any;
};

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
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data?.error || 'Unknown error');
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
