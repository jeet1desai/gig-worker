import { paypalClient } from './paypalClient';
import { getPayPalAccessToken } from './index';
import { endpoints } from '@/lib/config/endpoints';

export async function getSubscription(subscriptionId: string) {
  const accessToken = await getPayPalAccessToken();

  try {
    const res = await paypalClient.get(
      `${endpoints.payPalSubscriptions}/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return res.data;
  } catch (err: any) {
    console.error('PayPal getSubscription error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Failed to fetch PayPal subscription');
  }
}
