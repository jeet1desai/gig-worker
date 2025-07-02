import { BarChart3, Briefcase, Users2Icon } from 'lucide-react';
import { PRIVATE_ROUTE } from './app-routes';

export const constant = 'CONST';
export const EMAIL_TOKEN_EXPIRY_TIME = '1h';
export const BRAND_NAME = 'Gig Workers';
export const BASE_API_URL = '/api';

export const DASHBOARD_NAVIGATION_MENU = [
  { name: 'Dashboard', icon: BarChart3, href: PRIVATE_ROUTE.DASHBOARD },
];

export const ADMIN_DASHBOARD_NAVIGATION_MENU = [
  { name: 'Users', icon: Users2Icon, href: PRIVATE_ROUTE.ADMIN_USERS_DASHBOARD_PATH },
  { name: 'Gigs', icon: Briefcase, href: PRIVATE_ROUTE.ADMIN_GIGS_DASHBOARD_PATH },
];
