import { DEFAULT_PAGINATION } from '@/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GigState {
  loading: boolean;

  gigs: any[];
  ownGigs: any[];
  bids: any[];
  userPipeline: {
    open: any[];
    inProgress: any[];
    completed: any[];
  };
  providerPipeline: any[];
  pagination: any;

  userPipelineCounts: {
    open: number;
    inProgress: number;
    completed: number;
  };
  providerPipelineCounts: any;
}

const initialState: GigState = {
  loading: false,

  gigs: [],
  ownGigs: [],
  bids: [],
  userPipeline: {
    open: [],
    inProgress: [],
    completed: []
  },
  providerPipeline: [],
  pagination: DEFAULT_PAGINATION,

  userPipelineCounts: {
    open: 0,
    inProgress: 0,
    completed: 0
  },
  providerPipelineCounts: null
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
    setUserPipeline: (state, action: PayloadAction<{ gigs: any[]; pagination: any; counts: any; status: string }>) => {
      const { gigs, pagination, counts, status } = action.payload;
      if (pagination.page === 1) {
        if (status === 'open') {
          state.userPipeline.open = gigs;
        } else if (status === 'in_progress') {
          state.userPipeline.inProgress = gigs;
        } else if (status === 'completed') {
          state.userPipeline.completed = gigs;
        }
      } else {
        if (status === 'open') {
          state.userPipeline.open = [...state.userPipeline.open, ...gigs];
        } else if (status === 'in_progress') {
          state.userPipeline.inProgress = [...state.userPipeline.inProgress, ...gigs];
        } else if (status === 'completed') {
          state.userPipeline.completed = [...state.userPipeline.completed, ...gigs];
        }
      }
      state.userPipelineCounts = counts;
      state.pagination = pagination;
    },
    setProviderPipeline: (state, action: PayloadAction<{ gigs: any[]; pagination: any; counts: any }>) => {
      const { gigs, pagination, counts } = action.payload;
      if (pagination.page === 1) {
        state.providerPipeline = gigs;
      } else {
        state.providerPipeline = [...state.providerPipeline, ...gigs];
      }
      // state.providerPipelineCounts = counts;
      state.pagination = pagination;
    },
    clearPipeline: (state) => {
      state.userPipeline = {
        open: [],
        inProgress: [],
        completed: []
      };
      state.providerPipeline = [];
      state.pagination = DEFAULT_PAGINATION;
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

export const {
  setLoading,
  setGigs,
  setOwnGigs,
  setBids,
  clearBids,
  clearGigs,
  removeGig,
  updateBid,
  setUserPipeline,
  setProviderPipeline,
  clearPipeline
} = gigsSlice.actions;

export default gigsSlice.reducer;
