import { setLoading, setUserPipeline } from '@/store/slices/gigs';
import { AppDispatch } from '@/store/store';

import apiService from './api';
import { toast } from '@/lib/toast';

export const pipelineService = {
  getUserPipeline({ status, page, limit }: { status: string; page: number; limit: number }) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response: any = await apiService.get(`/gigs/pipeline?status=${status}&page=${page}&limit=${limit}`, {
          withAuth: true
        });
        if (response.status === 200 && response.data) {
          dispatch(
            setUserPipeline({ gigs: response.data.data.gigs, pagination: response.data.data.pagination, counts: response.data.data.counts, status })
          );
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
