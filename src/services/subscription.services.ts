import apiService from '@/services/api';
import { PRIVATE_API_ROUTES } from '@/constants/app-routes';
import { ApiResponse } from '@/types/shared/api-response';
import { ISafeSubscription } from '@/types/fe/api-responses';

export const createSubscription = async (
  subscriptionId: string | null,
  planId?: string
): Promise<ApiResponse<ISafeSubscription>> => {
  const payload: Record<string, any> = {};

  if (subscriptionId) {
    payload.subscriptionId = subscriptionId;
  }

  if (planId) {
    payload.planId = planId;
  }

  const response = await apiService.post<ApiResponse<ISafeSubscription>>(
    PRIVATE_API_ROUTES.SUBSCRIPTION_CREATE_API,
    payload,
    { withAuth: true }
  );

  return response.data;
};
