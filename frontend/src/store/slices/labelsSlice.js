import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { labelsApi } from '../../api/labelsApi';

export const fetchLabel = createAsyncThunk('labels/fetchLabels', async () => {
  return await labelsApi.getAll();
});

export const deleteLabelThunk = createAsyncThunk('labels/deleteLabel', async id => {
  await labelsApi.remove(id);
  return id;
});

const labelsSlice = createSlice({
  name: 'labels',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLabel.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchLabel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchLabel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(deleteLabelThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(label => label.id !== action.payload);
      });
  },
});

export default labelsSlice.reducer;
