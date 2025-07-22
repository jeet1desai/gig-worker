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
      const { loading } = action.payload;
      state.loading = loading;
    },
    setGigs: (state, action: PayloadAction<{ gigs: any[]; pagination: any }>) => {
      const { gigs, pagination } = action.payload;
      if (pagination.page === 1) {
        state.gigs = gigs;
      } else {
        state.gigs = [...state.gigs, ...gigs];
      }
      state.pagination = pagination;
    },
    setOwnGigs: (state, action: PayloadAction<{ gigs: any[]; pagination: any }>) => {
      const { gigs, pagination } = action.payload;
      if (pagination.page === 1) {
        state.ownGigs = gigs;
      } else {
        state.ownGigs = [...state.ownGigs, ...gigs];
      }
      state.pagination = pagination;
    },
    clearGigs: (state) => {
      state.gigs = [];
      state.ownGigs = [];
      state.pagination = DEFAULT_PAGINATION;
    }
  }
});

export const { setLoading, setGigs, setOwnGigs, clearGigs } = gigsSlice.actions;

export default gigsSlice.reducer;
