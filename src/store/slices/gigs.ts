import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GigState {
  loading: boolean;
}

const initialState: GigState = {
  loading: false
};

const gigsSlice = createSlice({
  name: 'gig',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.loading = action.payload.loading;
    }
  }
});

export const { setLoading } = gigsSlice.actions;

export default gigsSlice.reducer;
