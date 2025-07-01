export const LANDING_PAGE_PATH = '/landingpage';
export const USER_LOGIN_PAGE_PATH = '/auth/login';
export const SIGNUP_PAGE_PATH = '/auth/signup';
export const FORGOT_PASSWORD_PAGE_PATH = '/auth/forgot-password';
export const VERIFY_OTP_PAGE_PATH = '/auth/verify-otp';
export const RESET_PASSWORD_PAGE_PATH = '/auth/reset-password';
export const ABOUT_PAGE_PATH = '/auth/reset-password';
export const EMAIL_VERIFICATION_PATH = '/auth/email-verification';


export enum PUBLIC_ROUTE {
  UNKNOWN = '#',
  HOME = '/',
  LOGIN = '/auth/login',
  SIGNUP = '/auth/signup',
  FORGOT_PASSWORD = '/auth/forgot-password',
  VERIFY_OTP = '/auth/verify-otp',
  RESET_PASSWORD = '/auth/reset-password',
  LANDINGPAGE = '/landingpage',
  NOT_FOUND = '*',
}

export enum PRIVATE_ROUTE {
  DASHBOARD = '/dashboard',
  USER_PROFILE = '/profile',
}
