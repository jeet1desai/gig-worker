import { DEFAULT_PAGINATION } from '@/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GigState {
  loading: boolean;

  gigs: any[];
  ownGigs: any[];
  bids: any[];
  pagination: any;
}

const initialState: GigState = {
  loading: false,

  gigs: [],
  ownGigs: [],
  bids: [],
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
    setBids: (state, action: PayloadAction<{ bids: any[]; pagination: any }>) => {
      const { bids, pagination } = action.payload;
      if (pagination.page === 1) {
        state.bids = bids;
      } else {
        state.bids = [...state.bids, ...bids];
      }
      state.pagination = pagination;
    },
    updateBid: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const { id, status } = action.payload;
      state.bids = state.bids.map((bid) => (bid.id === id ? { ...bid, status: status === 'reject' ? 'rejected' : 'accepted' } : bid));
    },
    clearBids: (state) => {
      state.bids = [];
      state.pagination = DEFAULT_PAGINATION;
    },
    clearGigs: (state) => {
      state.gigs = [];
      state.ownGigs = [];
      state.pagination = DEFAULT_PAGINATION;
    },
    removeGig: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.ownGigs = state.ownGigs.filter((gig) => gig.id !== id);
    }
  }
});

export const { setLoading, setGigs, setOwnGigs, setBids, clearBids, clearGigs, removeGig, updateBid } = gigsSlice.actions;

export default gigsSlice.reducer;
