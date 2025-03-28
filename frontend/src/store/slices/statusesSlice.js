import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStatuses } from '../../api/statusesApi';

export const fetchStatuses = createAsyncThunk('statuses/fetchStatuses', async () => {
  return await getStatuses();
});

const statusesSlice = createSlice({
  name: 'statuses',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStatuses.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default statusesSlice.reducer;
