import { BarChart3, Briefcase, PackagePlusIcon, Users2Icon, LayoutDashboard } from 'lucide-react';
import { PayPalButtonStyle } from '@paypal/paypal-js';
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
  intent: 'subscription',
  enableFunding: ['paypal', 'card'],
  clientId: publicEnv.NEXT_PUBLIC_PAYPAL_CLIENT_ID
};
export const PAYPAL_BUTTON_CONFIG: PayPalButtonStyle = {
  layout: 'vertical',
  color: 'black',
  shape: 'pill',
  label: 'subscribe'
};
export const TOKEN = 'token';

export const DASHBOARD_NAVIGATION_MENU = [
  { name: 'Dashboard', icon: BarChart3, href: PRIVATE_ROUTE.DASHBOARD },
  { name: 'Gigs', icon: Briefcase, href: PRIVATE_ROUTE.GIGS }
];

export const ADMIN_DASHBOARD_NAVIGATION_MENU = [
  {
    name: 'Tier System',
    icon: LayoutDashboard,
    href: PRIVATE_ROUTE.ADMIN_TIER_SYSTEM_DASHBOARD_PATH
  },
  { name: 'Users', icon: Users2Icon, href: PRIVATE_ROUTE.ADMIN_USERS_DASHBOARD_PATH },
  { name: 'Gigs', icon: Briefcase, href: PRIVATE_ROUTE.ADMIN_GIGS_DASHBOARD_PATH },
  {
    name: 'Subscription Plans',
    icon: PackagePlusIcon,
    href: PRIVATE_ROUTE.ADMIN_SUBSCRIPTION_PLANS_DASHBOARD_PATH
  }
];

export const GIGS_LIST = [
  {
    id: 1,
    title: 'Calculus Tutoring Session',
    provider: 'Sarah Chen',
    rating: 3.9,
    price: 45,
    status: 'Active',
    completions: 28,
    earnings: 1260
  },
  {
    id: 2,
    title: 'Career Counseling',
    provider: 'Mike Johnson',
    rating: 4.7,
    price: 35,
    status: 'Active',
    completions: 15,
    earnings: 525
  },
  {
    id: 3,
    title: 'Laundry Service',
    provider: 'Emma Davis',
    rating: 2.9,
    price: 12,
    status: 'Paused',
    completions: 12,
    earnings: 204
  }
];

export const TIER_DATA_LIST = {
  basic: {
    title: 'Basic Tier',
    description: 'Simple tasks that require minimal skill but provide essential help to students.',
    examples: 'Laundry, food pickup, move-in/move-out help, package delivery',
    stats: {
      totalGigs: 245,
      avgRating: 4.6,
      totalEarnings: 12450,
      activeProviders: 78
    },
    color: 'bg-emerald-900/30 text-emerald-300 border-emerald-700',
    bgGradient: 'from-emerald-950/50 to-green-950/30 border-l-emerald-500'
  },
  advanced: {
    title: 'Advanced Tier',
    description: 'Knowledge-based services requiring experience and good judgment.',
    examples: 'Academic advice, major selection guidance, career counseling, campus navigation',
    stats: {
      totalGigs: 189,
      avgRating: 4.8,
      totalEarnings: 28750,
      activeProviders: 56
    },
    color: 'bg-blue-900/30 text-blue-300 border-blue-700',
    bgGradient: 'from-blue-950/50 to-indigo-950/30 border-l-blue-500'
  },
  expert: {
    title: 'Expert Tier',
    description: 'High-skill, specialized services requiring expertise and proven track record.',
    examples: 'Tutoring, homework help, interview preparation, grad school applications, schedule optimization',
    stats: {
      totalGigs: 156,
      avgRating: 4.9,
      totalEarnings: 47890,
      activeProviders: 34
    },
    color: 'bg-purple-900/30 text-purple-300 border-purple-700',
    bgGradient: 'from-purple-950/50 to-violet-950/30 border-l-purple-500'
  }
};

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
};

export const SIGNUP_MESSAGES = {
  USER_ALREADY_EXISTS: 'A user with this email already exists.',
  USER_CREATED_SUCCESS: 'User created successfully',
  INTERNAL_SERVER_ERROR: 'Something went wrong while creating the user.',
  success: 'Signup successful!',
  failure: 'Signup failed. Please try again.'
};

export const NOTIFICATION_MESSAGES = {
  USER_CREATED_TITLE: 'User Created',
  USER_CREATED: 'User created successfully.'
};

export const NOTIFICATION_MODULES = {
  SYSTEM: 'system'
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success'
};

export const BCRYPT_SALT_ROUNDS = 10;

export const EMAIL_VERIFICATION_MESSAGES = {
  VERIFYING: 'Verifying your email...',
  SUCCESS: 'Your email has been verified successfully!',
  FAILURE: 'Verification failed. Please try again to verify your email address.'
};

export const FORGOT_PASSWORD_MESSAGES = {
  title: 'Forgot password',
  subtitle: 'No worries, we’ll send you an OTP to your mail id',
  success: 'Check your inbox! Password reset link has been sent.',
  error: 'Failed to send reset email.'
};

export const LOGIN_MESSAGES = {
  emailNotVerified: 'Your email is not verified. Please verify your account.',
  invalidCredentials: 'Invalid email or password.'
};

export const RESET_PASSWORD_MESSAGES = {
  success: 'Password has been reset successfully.',
  validationError: 'Validation error occurred.',
  invalidOrExpiredToken: 'Reset password link is invalid or expired.',
  apiFallback: 'Failed to reset password.',
  redirectDelay: 3000
};

export const VERIFICATION_CODES = {
  TOKEN_MISSING: 'TOKEN_MISSING',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_OR_EXPIRED_TOKEN: 'INVALID_OR_EXPIRED_TOKEN',
  USER_ALREADY_VERIFIED: 'USER_ALREADY_VERIFIED',
  EMAIL_VERIFIED_SUCCESS: 'EMAIL_VERIFIED_SUCCESS',
  SOMETHING_WENT_WRONG: 'SOMETHING_WENT_WRONG',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
};

export const VERIFICATION_MESSAGES = {
  TOKEN_MISSING: 'Verification token is missing.',
  INVALID_OR_EXPIRED_TOKEN: 'Verification token is invalid or has expired.',
  USER_ALREADY_VERIFIED: 'User already verified.',
  EMAIL_VERIFIED_SUCCESS: 'Email verified successfully.',
  EMAIL_VERIFIED_NOTIFICATION_TITLE: 'Email Verified',
  EMAIL_VERIFIED_NOTIFICATION_MESSAGE: 'Your email has been verified successfully.'
};

export const COMMON_ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR_MESSAGE: 'Internal server error. Please try again later.',
  USER_NOT_FOUND_MESSAGE: 'User not found. Please check the provided information.',
  SOMETHING_WENT_WRONG_MESSAGE: 'Something went wrong. Please try again later.',
  INVALID_REQUEST: 'Invalid request. Please check your input and try again.',
  UNAUTHORIZED: 'Unauthorized access. Please log in and try again.',
  EMAIL_NOT_EXISTS: 'User with this email does not exist.',
  INVALID_REQUEST_PAYLOAD: 'Invalid request payload',
  VALIDATION_ERROR: 'Validation error occurred. Please check your input.'
};

export const SUBSCRIPTION_PLAN_TYPES = ['free', 'basic', 'pro'];
