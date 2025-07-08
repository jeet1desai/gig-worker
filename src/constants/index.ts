import { BarChart3, Briefcase, PackagePlusIcon, Users2Icon } from 'lucide-react';
import { PRIVATE_ROUTE } from './app-routes';

export const constant = 'CONST';
export const EMAIL_TOKEN_EXPIRY_TIME = '1h';
export const BRAND_NAME = 'Gig Workers';
export const BASE_API_URL = '/api';
export const CONTENT_TYPE = 'Content-Type';
export const APPLICATION_JSON = 'application/json';
export const TOKEN = 'token';

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
    features: ['Access as a User only', 'Rate and review providers after gigs', 'Only request a gig'],
  },
  {
    id: '2',
    name: 'Basic',
    price: 5,
    maxGigs: 3,
    maxBids: 5,
    description: 'Unleash the Power of Your Services with Basic Plan.',
    features: ['Post up to 3 gigs/month', 'Place up to 5 bids/month', 'No access to "Top Rated Seller" badge'],
  },
  {
    id: '3',
    name: 'Pro',
    description: 'Take Your Services to the Next Level with Pro Plan',
    price: 20,
    maxGigs: 365,
    maxBids: 365,
    features: ['Includes all Basic Plan features', 'Unlimited gig postings and bids', 'Eligible for Top Rated Seller badge'],
  },
];

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
};

export const SIGNUP_MESSAGES = {
  USER_ALREADY_EXISTS: 'A user with this email already exists.',
  USER_CREATED_SUCCESS: 'User created successfully',
  INTERNAL_SERVER_ERROR: 'Something went wrong while creating the user.',
  success: 'Signup successful!',
  failure: 'Signup failed. Please try again.',
};

export const NOTIFICATION_MESSAGES = {
  USER_CREATED_TITLE: 'User Created',
  USER_CREATED: 'User created successfully.',
};

export const NOTIFICATION_MODULES = {
  SYSTEM: 'system',
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
};

export const BCRYPT_SALT_ROUNDS = 10;

export const EMAIL_VERIFICATION_MESSAGES = {
  VERIFYING: 'Verifying your email...',
  SUCCESS: 'Your email has been verified successfully!',
  FAILURE: 'Verification failed. Please try again to verify your email address.',
};

export const FORGOT_PASSWORD_MESSAGES = {
  title: 'Forgot password',
  subtitle: 'No worries, we’ll send you an OTP to your mail id',
  success: 'Check your inbox! Password reset link has been sent.',
  error: {
    default: 'Failed to send reset email.',
  },
};

export const LOGIN_MESSAGES = {
  emailNotVerified: 'Your email is not verified. Please verify your account.',
  invalidCredentials: 'Invalid email or password.',
};

export const RESET_PASSWORD_MESSAGES = {
  success: 'Password has been reset successfully.',
  validationError: 'Validation error occurred.',
  invalidOrExpiredToken: 'Reset password link is invalid or expired.',
  apiFallback: 'Failed to reset password.',
  redirectDelay: 3000,
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
  VALIDATION_ERROR: 'VALIDATION_ERROR',
};

export const VERIFICATION_MESSAGES = {
  TOKEN_MISSING: 'Verification token is missing.',
  INVALID_OR_EXPIRED_TOKEN: 'Verification token is invalid or has expired.',
  USER_ALREADY_VERIFIED: 'User already verified.',
  EMAIL_VERIFIED_SUCCESS: 'Email verified successfully.',
  EMAIL_VERIFIED_NOTIFICATION_TITLE: 'Email Verified',
  EMAIL_VERIFIED_NOTIFICATION_MESSAGE: 'Your email has been verified successfully.',
};

export const COMMON_ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR_MESSAGE: 'Internal server error. Please try again later.',
  USER_NOT_FOUND_MESSAGE: 'User not found. Please check the provided information.',
  SOMETHING_WENT_WRONG_MESSAGE: 'Something went wrong. Please try again later.',
  INVALID_REQUEST: 'Invalid request. Please check your input and try again.',
  UNAUTHORIZED: 'Unauthorized access. Please log in and try again.',
  EMAIL_NOT_EXISTS: 'User with this email does not exist.',
  INVALID_REQUEST_PAYLOAD: 'Invalid request payload',
  VALIDATION_ERROR: 'Validation error occurred. Please check your input.',
};
