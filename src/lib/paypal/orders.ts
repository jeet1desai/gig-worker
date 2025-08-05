import { paypalV2Client } from './paypalClient';
import { getPayPalAccessToken } from './index';
import { PRIVATE_ROUTE } from '@/constants/app-routes';
import { endpoints } from '../config/endpoints';
import { publicEnv } from '../config/publicEnv';

interface CreateOrderParams {
  amount: string;
  gigId: string;
  paymentId: string;
  slug: string
  description: string;
}

export async function createPayPalOrder({ amount, gigId, paymentId, description, slug }: CreateOrderParams) {
  try {
    const accessToken = await getPayPalAccessToken();

    const baseUrl = publicEnv.NEXT_PUBLIC_BASE_URL;

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: paymentId,
          custom_id: gigId,
          description: description,
          amount: {
            currency_code: 'USD',
            value: amount
          }
        }
      ],
      application_context: {
        return_url: `${baseUrl}${PRIVATE_ROUTE.GIGS}/${slug}${PRIVATE_ROUTE.GIG_PAYEMNT_SUCCESS_PATH}`,
        cancel_url: `${baseUrl}${PRIVATE_ROUTE.GIGS}/${slug}${PRIVATE_ROUTE.GIG_PAYEMNT_CANCLE_PATH}`
      }
    };

    const response = await paypalV2Client.post(endpoints.payPalOrders, orderData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('Error creating PayPal order:', error);
    console.error('Error details:', error.response?.data);
    throw new Error(`Failed to create PayPal order: ${error.response?.data?.message || error.message}`);
  }
}

export async function capturePayPalOrder(orderId: string) {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await paypalV2Client.post(
      `${endpoints.payPalOrders}/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error capturing PayPal order:', error);
    console.error('Error details:', error.response?.data);
    throw new Error(`Failed to capture PayPal order: ${error.response?.data?.message || error.message}`);
  }
}

export async function getPayPalOrder(orderId: string) {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await paypalV2Client.get(`${endpoints.payPalOrders}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('Error getting PayPal order:', error);
    console.error('Error details:', error.response?.data);
    throw new Error(`Failed to get PayPal order: ${error.response?.data?.message || error.message}`);
  }
}
