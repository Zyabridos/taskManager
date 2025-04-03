import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { statusesApi } from '../../api/statusesApi';

export const fetchStatuses = createAsyncThunk('statuses/fetchStatuses', async () => {
  return await statusesApi.getAll();
});

export const deleteStatusThunk = createAsyncThunk(
  'statuses/delete',
  async (id, { rejectWithMessage }) => {
    try {
      await statusesApi.remove(id);
      return id;
    } catch (err) {
      return rejectWithMessage(err);
    }
  }
);

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
      })

      .addCase(deleteStatusThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(status => status.id !== action.payload);
      });
  },
});

export default statusesSlice.reducer;
