import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GigState {
  loading: boolean;
  recentGigs: any[];
}

const initialState: GigState = {
  loading: false,
  recentGigs: []
};

const dashboardSlice = createSlice({
  name: 'gig',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      const { loading } = action.payload;
      state.loading = loading;
    },
    setRecentGig: (state, action: PayloadAction<{ gigs: any }>) => {
      const { gigs } = action.payload;
      state.recentGigs = gigs.gigs || [];
    }
  }
});

export const { setLoading, setRecentGig } = dashboardSlice.actions;

export default dashboardSlice.reducer;
