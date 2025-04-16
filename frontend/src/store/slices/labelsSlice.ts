import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { labelsApi } from '../../api/labelsApi';
import { getErrorPayload } from '@/utils/errorsHandlers';
import { Label } from '../../types/entities';
interface LabelsState {
  list: Label[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LabelsState = {
  list: [],
  status: 'idle',
  error: null,
};

export const fetchLabel = createAsyncThunk<Label[]>('labels/fetchLabels', async () => {
  return await labelsApi.getAll();
});

export const deleteLabelThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: { error: string } }
>('labels/delete', async (id, { rejectWithValue }) => {
  try {
    await labelsApi.remove(id);
    return id;
  } catch (err: unknown) {
    return rejectWithValue(getErrorPayload(err));
  }
});

const labelsSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLabel.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchLabel.fulfilled, (state, action: PayloadAction<Label[]>) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchLabel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(deleteLabelThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.list = state.list.filter(label => label.id !== action.payload);
      });
  },
});

export default labelsSlice.reducer;
