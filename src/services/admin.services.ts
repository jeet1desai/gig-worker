import { setLoading, setAdminUsers } from '@/store/slices/admin-user';
import { AppDispatch } from '@/store/store';

import apiService from './api';

import { toast } from 'react-toastify';

export const adminService = {
  getAdminUsers({ page, pageSize, sortKey, sortOrder }: { page: number; pageSize: number; sortKey: string; sortOrder: string }) {
    return async (dispatch: AppDispatch) => {
      dispatch(setLoading({ loading: true }));
      try {
        const response = await apiService.get(`/users?page=${page}&pageSize=${pageSize}&sortBy=${sortKey}&order=${sortOrder}`, {
          withAuth: true,
        });
        if (response.data && response.status === 200) {
          const { items, meta }: any = response.data;
          dispatch(setAdminUsers({ users: items, pagination: meta }));
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },
};
