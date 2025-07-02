import { BarChart3, Briefcase, Users2Icon } from 'lucide-react';

export const constant = 'CONST';
export const EMAIL_TOKEN_EXPIRY_TIME = '1h';
export const BRAND_NAME = 'Gig Workers';
export const BASE_API_URL = '/api';

export const user_navigation_menu = [{ name: 'Dashboard', icon: BarChart3, href: '/dashboard' }];

export const super_admin_navigation_menu = [
  { name: 'Users', icon: Users2Icon, href: '/admin/dashboard/users' },
  { name: 'Gigs', icon: Briefcase, href: '/admin/dashboard/gigs' },
];

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
};
