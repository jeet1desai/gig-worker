import { DEFAULT_PAGINATION } from '@/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  loading: boolean;

  users: any[];
  pagination: any;
}

const initialState: UserState = {
  loading: false,
  users: [],
  pagination: DEFAULT_PAGINATION,
};

const adminUserSlice = createSlice({
  name: 'adminUser',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.loading = action.payload.loading;
    },
    setAdminUsers: (state, action: PayloadAction<{ users: any[]; pagination: any }>) => {
      state.users = action.payload.users;
      state.pagination = action.payload.pagination;
      state.loading = false;
    },
    deleteAdminUsers: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.users = state.users.filter((user) => user.id !== id);
    },
    setPage: (state, action: PayloadAction<{ page: number }>) => {
      state.pagination.page = action.payload.page;
    },
  },
});

export const { setLoading, setAdminUsers, deleteAdminUsers, setPage } = adminUserSlice.actions;

export default adminUserSlice.reducer;
