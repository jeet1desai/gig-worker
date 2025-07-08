import { setLoading, setAdminUsers, deleteAdminUsers, createAdminUsers } from '@/store/slices/admin-user';
import { AppDispatch } from '@/store/store';

import apiService from './api';

import { toast } from 'react-toastify';

export const adminService = {
  getAdminUsers({
    page,
    pageSize,
    sortKey,
    sortOrder,
    search,
  }: {
    page: number;
    pageSize: number;
    sortKey: string;
    sortOrder: string;
    search: string;
  }) {
    return async (dispatch: AppDispatch) => {
      dispatch(setLoading({ loading: true }));
      try {
        const response = await apiService.get(`/users?page=${page}&pageSize=${pageSize}&sortBy=${sortKey}&order=${sortOrder}&search=${search}`, {
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

  deleteAdminUsers({ id }: { id: string }) {
    return async (dispatch: AppDispatch) => {
      dispatch(setLoading({ loading: true }));
      try {
        const response = await apiService.delete(`/users/${id}`, {
          withAuth: true,
        });
        if (response.data && response.status === 200) {
          dispatch(deleteAdminUsers({ id: id }));
          toast.success('User deleted successfully');
          return response.data;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  createAdminUsers({ body }: { body: any }) {
    return async (dispatch: AppDispatch) => {
      dispatch(setLoading({ loading: true }));
      try {
        const response: any = await apiService.post(`/users`, body, {
          withAuth: true,
        });
        if (response.status === 201 && response.data) {
          dispatch(createAdminUsers({ user: response.data.data }));
          toast.success('User created successfully');
          return response.data;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  getUserDetails({ id }: { id: string }) {
    return async (dispatch: AppDispatch) => {
      dispatch(setLoading({ loading: true }));
      try {
        const response = await apiService.get(`/users/${id}`, {
          withAuth: true,
        });
        if (response.status === 200 && response.data) {
          return response.data;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  updateAdminUsers({ id, body }: { id: string; body: any }) {
    return async (dispatch: AppDispatch) => {
      dispatch(setLoading({ loading: true }));
      try {
        const response = await apiService.patch(`/users/${id}`, body, {
          withAuth: true,
        });
        if (response.status === 200 && response.data) {
          return response.data;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },
};
