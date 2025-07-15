import { setLoading } from '@/store/slices/gigs';
import { AppDispatch } from '@/store/store';

import apiService from './api';

import { toast } from '@/lib/toast';

export const gigService = {
  createGig({ body }: { body: FormData }) {
    return async (dispatch: AppDispatch) => {
      dispatch(setLoading({ loading: true }));
      try {
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
  }
};
