import { setLoading, setUserPipeline, setProviderPipeline } from '@/store/slices/gigs';
import { AppDispatch } from '@/store/store';
import { UserPipelineResponse, ProviderPipelineResponse } from '@/types/pipeline';

import apiService from './api';
import { toast } from '@/lib/toast';
import { PRIVATE_API_ROUTES } from '@/constants/app-routes';

export const pipelineService = {
  getUserPipeline({ status, page, limit }: { status: string; page: number; limit: number }) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response = await apiService.get<UserPipelineResponse>(
          `${PRIVATE_API_ROUTES.USER_PIPELINE_API}?status=${status}&page=${page}&limit=${limit}`,
          {
            withAuth: true
          }
        );
        if (response.status === 200 && response.data) {
          dispatch(
            setUserPipeline({ gigs: response.data.data.gigs, pagination: response.data.data.pagination, counts: response.data.data.counts, status })
          );
          return response.data;
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        toast.error(errorMessage);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  },

  getProviderPipeline({ status, page, limit }: { status: string; page: number; limit: number }) {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response = await apiService.get<ProviderPipelineResponse>(
          `${PRIVATE_API_ROUTES.PROVIDER_PIPELINE_API}?status=${status}&page=${page}&limit=${limit}`,
          {
            withAuth: true
          }
        );
        if (response.status === 200 && response.data) {
          dispatch(
            setProviderPipeline({
              bids: response.data.data.bids,
              pagination: response.data.data.pagination,
              counts: response.data.data.counts
            })
          );
          return response.data;
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        toast.error(errorMessage);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  }
};
