import { setGigs, setLoading, clearGigs, setOwnGigs } from '@/store/slices/gigs';
import { AppDispatch } from '@/store/store';

import apiService from './api';

import { toast } from '@/lib/toast';

export const gigService = {
  createGig({ body }: { body: FormData }) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response: any = await apiService.post(`/gigs`, body, {
          withAuth: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status === 201 && response.data) {
          toast.success('Gig created successfully');
          return response.data;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error?.message);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  getGigs({ page, search }: { page: number; search?: string }) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response: any = await apiService.get(`/gigs?page=${page}${search ? `&search=${search}` : ''}`, {
          withAuth: true
        });
        if (response.status === 200 && response.data) {
          dispatch(setGigs({ gigs: response.data.data.gigs, pagination: response.data.data.pagination }));
          return response.data;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error?.message);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  clearGigs() {
    return async (dispatch: AppDispatch) => {
      dispatch(clearGigs());
    };
  },

  getGigById(id: string) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response: any = await apiService.get(`/gigs/${id}`, {
          withAuth: true
        });
        if (response.status === 200 && response.data) {
          return response.data;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error?.message || 'Failed to fetch gig details');
        throw error;
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  getOwnersGig({ page, search }: { page: number; search?: string }) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response: any = await apiService.get(`/gigs/me?page=${page}${search ? `&search=${search}` : ''}`, {
          withAuth: true
        });
        if (response.status === 200 && response.data) {
          dispatch(setOwnGigs({ gigs: response.data.data.gigs, pagination: response.data.data.pagination }));
          return response.data;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error?.message);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  }
};
