interface PublicEnv {
  NEXT_PUBLIC_BASE_URL: string
  NEXT_PUBLIC_BRAND_NAME: string
  NEXT_PUBLIC_SOCKET_URL: string
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: string
}

export const publicEnv: PublicEnv = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  NEXT_PUBLIC_BRAND_NAME: process.env.NEXT_PUBLIC_BRAND_NAME || 'Gig Workers',
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''
}
