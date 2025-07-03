import { endpoints } from '@/lib/config/endpoints';
import { serverEnv } from '@/lib/config/serverEnv';
import { paypalClient } from '@/lib/paypal/paypalClient';

export const getPayPalAccessToken = async (): Promise<string> => {
  const clientId = serverEnv.PAYPAL_CLIENT_ID;
  const clientSecret = serverEnv.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal credentials');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await paypalClient.post(endpoints.payPalAccessToken, 'grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error: any) {
    const errData = error.response?.data || {};
    console.error('PayPal Auth Error:', errData);
    throw new Error(errData.error_description || 'Failed to get PayPal access token');
  }
};
