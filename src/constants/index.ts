import { PayPalButtonStyle } from '@paypal/paypal-js';
import { BarChart3, Briefcase, Users2Icon } from 'lucide-react';
import { PRIVATE_ROUTE } from './app-routes';
import { publicEnv } from '@/lib/config/publicEnv';

export const constant = 'CONST';
export const EMAIL_TOKEN_EXPIRY_TIME = '1h';
export const BRAND_NAME = 'Gig Workers';
export const BASE_API_URL = '/api';
export const CONTENT_TYPE = 'Content-Type';
export const APPLICATION_JSON = 'application/json';
export const PAYPAL_CONFIG_OPTIONS = {
  vault: true,
  currency: 'USD',
  debug: true,
  intent: 'subscription',
  enableFunding: ['paypal', 'card'],
  clientId: publicEnv.NEXT_PUBLIC_PAYPAL_CLIENT_ID
};
export const PAYPAL_BUTTON_CONFIG: PayPalButtonStyle = {
  layout: 'vertical',
  color: 'white',
  shape: 'pill',
  label: 'subscribe'
};

export const DASHBOARD_NAVIGATION_MENU = [
  { name: 'Dashboard', icon: BarChart3, href: PRIVATE_ROUTE.DASHBOARD }
];

export const ADMIN_DASHBOARD_NAVIGATION_MENU = [
  { name: 'Users', icon: Users2Icon, href: PRIVATE_ROUTE.ADMIN_USERS_DASHBOARD_PATH },
  { name: 'Gigs', icon: Briefcase, href: PRIVATE_ROUTE.ADMIN_GIGS_DASHBOARD_PATH }
];

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
};
