import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { statusesApi } from '../../api/statusesApi';

export interface Status {
  id: number;
  name: string;
}

interface StatusesState {
  list: Status[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: StatusesState = {
  list: [],
  status: 'idle',
  error: null,
};

export const fetchStatuses = createAsyncThunk<Status[]>('statuses/fetchStatuses', async () => {
  return await statusesApi.getAll();
});

export const deleteStatusThunk = createAsyncThunk<number, number, { rejectValue: string }>(
  'statuses/delete',
  async (id, { rejectWithValue }) => {
    try {
      await statusesApi.remove(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete status');
    }
  },
);

const statusesSlice = createSlice({
  name: 'statuses',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStatuses.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchStatuses.fulfilled, (state, action: PayloadAction<Status[]>) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(deleteStatusThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.list = state.list.filter(status => status.id !== action.payload);
      });
  },
});

export default statusesSlice.reducer;
