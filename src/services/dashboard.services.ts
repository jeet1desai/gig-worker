import { setLoading, setRecentGig } from '@/store/slices/dashboard';
import { AppDispatch } from '@/store/store';
import apiService from './api';
import { ApiResponse } from '@/types/shared/api-response';
import { toast } from '@/lib/toast';
import { PRIVATE_API_ROUTES } from '@/constants/app-routes';

export const dashboardService = {
  getRecentGigs() {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response: any = await apiService.get<ApiResponse<any>>(PRIVATE_API_ROUTES.DASHBOARD_RECENT_GIGS_API, { withAuth: true });
        if (response.status === 200 && response.data) {
          dispatch(setRecentGig({ gigs: response.data.data }));
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error?.message);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };
  }
};
