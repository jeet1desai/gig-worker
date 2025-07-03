import { endpoints } from '@/lib/config/endpoints'
import { serverEnv } from '@/lib/config/serverEnv'

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = serverEnv.PAYPAL_CLIENT_ID
  const clientSecret = serverEnv.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) throw new Error('Missing PayPal credentials')

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const res = await fetch(`${serverEnv.PAYPAL_BASE_URL}${endpoints.payPalAccessToken}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })

  if (!res.ok) {
    const err = await res.json()
    console.error('PayPal Auth Error:', err)
    throw new Error(err.error_description || 'Failed to get PayPal access token')
  }

  const data = await res.json()
  return data.access_token
}
