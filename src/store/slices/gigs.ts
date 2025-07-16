import { DEFAULT_PAGINATION } from '@/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GigState {
  loading: boolean;

  gigs: any[];
  ownGigs: any[];
  pagination: any;
}

const initialState: GigState = {
  loading: false,

  gigs: [],
  ownGigs: [],
  pagination: DEFAULT_PAGINATION
};

const gigsSlice = createSlice({
  name: 'gig',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.loading = action.payload.loading;
    },
    setGigs: (state, action: PayloadAction<{ gigs: any[]; pagination: any }>) => {
      state.gigs = [...state.gigs, ...action.payload.gigs];
      state.pagination = action.payload.pagination;
    },
    setOwnGigs: (state, action: PayloadAction<{ gigs: any[]; pagination: any }>) => {
      state.ownGigs = [...state.ownGigs, ...action.payload.gigs];
      state.pagination = action.payload.pagination;
    },
    clearGigs: (state) => {
      state.gigs = [];
      state.pagination = DEFAULT_PAGINATION;
    }
  }
});

export const { setLoading, setGigs, setOwnGigs, clearGigs } = gigsSlice.actions;

export default gigsSlice.reducer;
