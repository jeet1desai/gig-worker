export const LINKEDIN_PROFILE_PATH = 'https://www.linkedin.com';
export const FACEBOOK_PROFILE_PATH = 'https://www.facebook.com';
export const TWITTER_PROFILE_PATH = 'https://www.twitter.com';
export const INSTAGRAM_PROFILE_PATH = 'https://www.instagram.com';

export enum PUBLIC_ROUTE {
  UNKNOWN = '#',
  HOME = '/',
  ABOUT = '/about',
  LANDING_PAGE_PATH = '/landingpage',
  USER_LOGIN_PAGE_PATH = '/auth/login',
  SIGNUP_PAGE_PATH = '/auth/signup',
  FORGOT_PASSWORD_PAGE_PATH = '/auth/forgot-password',
  VERIFY_OTP_PAGE_PATH = '/auth/verify-otp',
  RESET_PASSWORD_PAGE_PATH = '/auth/reset-password',
  ADMIN_LOGIN_PATH = '/admin/login',
}

export enum PRIVATE_ROUTE {
  DASHBOARD = '/dashboard',
  USER_PROFILE = '/profile',
  ADMIN_DASHBOARD_PATH = '/admin/dashboard',
}

export enum PUBLIC_API_ROUTES {
  LOGIN_API = '/api/auth/login',
  SIGNUP_API = '/api/auth/signup',
  VERIFY_EMAIL_API = '/api/auth/verify-email',
  FORGOT_PASSWORD_API = '/api/auth/forgot-password',
  RESET_PASSWORD_API = '/api/auth/reset-password',
}
