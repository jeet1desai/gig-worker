import { paypalClient } from './paypalClient';
import { getPayPalAccessToken } from './index';
import { endpoints } from '@/lib/config/endpoints';
import { PAYPAL_SUBSCRIPTION_CANCEL_REASON } from '@/enums/be/paypal';

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

export async function cancelSubscription(
  subscriptionId: string,
  reason: PAYPAL_SUBSCRIPTION_CANCEL_REASON
) {
  const accessToken = await getPayPalAccessToken();

  try {
    const url = `${endpoints.payPalSubscriptions}/${subscriptionId}/cancel`;

    const res = await paypalClient.post(
      url,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (res.status === 204) {
      return true;
    } else {
      return false;
    }
  } catch (err: any) {
    throw new Error(
      `Failed to cancel PayPal subscription: ${err.response?.data?.message || err.message}`
    );
  }
}
