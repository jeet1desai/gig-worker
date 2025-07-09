import { paypalClient } from './paypalClient';
import { getPayPalAccessToken } from './index';
import { endpoints } from '@/lib/config/endpoints';

type QueryFields =
  | ['last_failed_payment']
  | ['plan']
  | ['last_failed_payment', 'plan']
  | ['plan', 'last_failed_payment'];

export async function getSubscription(subscriptionId: string, fields?: QueryFields) {
  const accessToken = await getPayPalAccessToken();

  try {
    let url = `${endpoints.payPalSubscriptions}/${subscriptionId}`;

    if (fields && fields.length > 0) {
      const params = new URLSearchParams();
      params.append('fields', fields.join(','));
      url += `?${params.toString()}`;
    }

    const res = await paypalClient.get(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return res.data;
  } catch (err: any) {
    console.error('PayPal get subscription error:', err.response?.data || err.message);
    return null;
  }
}
