import { paypalClient } from './paypalClient';
import { getPayPalAccessToken } from './index';
import { PayPalPlan, PayPalPlansResponse } from '@/types/paypal';
import { endpoints } from '@/lib/config/endpoints';

export async function listSubscriptionPlans(): Promise<PayPalPlan[]> {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await paypalClient.get<PayPalPlansResponse>(endpoints.payPalPlans, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'return=representation',
      },
      params: {
        page_size: 20,
        status: 'ACTIVE',
        sort_by: 'create_time',
        sort_order: 'desc',
        total_required: true,
      },
    });
    return response.data.plans;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch PayPal plans';
    throw new Error(message);
  }
}
