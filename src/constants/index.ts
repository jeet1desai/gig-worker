import { BarChart3, Briefcase, PackagePlusIcon, Users2Icon } from 'lucide-react';
import { PRIVATE_ROUTE } from './app-routes';

export const constant = 'CONST';
export const EMAIL_TOKEN_EXPIRY_TIME = '1h';
export const BRAND_NAME = 'Gig Workers';
export const BASE_API_URL = '/api';
export const CONTENT_TYPE = 'Content-Type';
export const APPLICATION_JSON = 'application/json';

export const DASHBOARD_NAVIGATION_MENU = [{ name: 'Dashboard', icon: BarChart3, href: PRIVATE_ROUTE.DASHBOARD }];

export const ADMIN_DASHBOARD_NAVIGATION_MENU = [
  { name: 'Users', icon: Users2Icon, href: PRIVATE_ROUTE.ADMIN_USERS_DASHBOARD_PATH },
  { name: 'Gigs', icon: Briefcase, href: PRIVATE_ROUTE.ADMIN_GIGS_DASHBOARD_PATH },
  {
    name: 'Subscription Plans',
    icon: PackagePlusIcon,
    href: PRIVATE_ROUTE.ADMIN_SUBSCRIPTION_PLANS_DASHBOARD_PATH,
  },
];

export const SUBSCRIPTION_PLANS_LIST = [
  {
    id: '1',
    name: 'Free',
    description: 'Get started with essential features at no cost.',
    price: 0,
    maxGigs: 0,
    maxBids: 3,
    features: [
      'Access as a User only',
      'Rate and review providers after gigs',
      'Only request a gig',
    ],
  },
  {
    id: '2',
    name: 'Basic',
    price: 5,
    maxGigs: 3,
    maxBids: 5,
    description: 'Unleash the Power of Your Services with Basic Plan.',
    features: [
      'Post up to 3 gigs/month',
      'Place up to 5 bids/month',
      'No access to "Top Rated Seller" badge',
    ],
  },
  {
    id: '3',
    name: 'Pro',
    description: 'Take Your Services to the Next Level with Pro Plan',
    price: 20,
    maxGigs: 365,
    maxBids: 365,
    features: [
      'Includes all Basic Plan features',
      'Unlimited gig postings and bids',
      'Eligible for Top Rated Seller badge',
    ],
  },
];

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
};
