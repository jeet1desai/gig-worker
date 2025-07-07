import { HttpStatusCode } from '@/enums/shared/http-status-code';
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

export const getProductId = async (): Promise<{ id: string; access_token: string }> => {
  const access_token = await getPayPalAccessToken();
  try {
    const response = await paypalClient.get(`${endpoints.payPalProductList}?page_size=1&page=1&total_required=true`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    return { id: response.data.products[0].id, access_token: access_token };
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch PayPal product list';
    throw new Error(message);
  }
};

export const getPlanDetailsById = async (id: string): Promise<any> => {
  const access_token = await getPayPalAccessToken();
  try {
    const response = await paypalClient.get(`${endpoints.payPalPlans}/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.data && response.status === HttpStatusCode.OK) {
      return response.data;
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch PayPal product list';
    throw new Error(message);
  }
};
