import { endpoints } from './../config/endpoints';
import { serverEnv } from '@/lib/config/serverEnv';
import { paypalClient } from '@/lib/paypal/paypalClient';
import { getPayPalAccessToken } from '@/lib/paypal';

export async function verifyWebhookSignature(req: Request, body: any) {
  const transmissionId = req.headers.get('paypal-transmission-id') || '';
  const transmissionTime = req.headers.get('paypal-transmission-time') || '';
  const certUrl = req.headers.get('paypal-cert-url') || '';
  const authAlgo = req.headers.get('paypal-auth-algo') || '';
  const transmissionSig = req.headers.get('paypal-transmission-sig') || '';

  if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
    console.error('Missing PayPal headers for webhook verification');
    return false;
  }

  let accessToken = '';
  try {
    accessToken = await getPayPalAccessToken();
  } catch (err) {
    console.error('Failed to get PayPal access token', err);
    return false;
  }

  try {
    const verifyRes = await paypalClient.post(
      endpoints.payPalWebhook,
      {
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: serverEnv.PAYPAL_WEBHOOK_ID,
        webhook_event: body
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return verifyRes.data.verification_status === 'SUCCESS';
  } catch (err) {
    console.error('Failed to verify PayPal webhook signature', err);
    return false;
  }
}
