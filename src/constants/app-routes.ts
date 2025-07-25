export const LINKEDIN_PROFILE_PATH = 'https://www.linkedin.com';
export const FACEBOOK_PROFILE_PATH = 'https://www.facebook.com';
export const TWITTER_PROFILE_PATH = 'https://www.twitter.com';
export const INSTAGRAM_PROFILE_PATH = 'https://www.instagram.com';

export enum PUBLIC_ROUTE {
  UNKNOWN = '#',
  HOME = '/',
  RESET_PASSWORD = '/reset-password',
  ABOUT = '/about',
  LANDING_PAGE_PATH = '/landingpage',
  USER_LOGIN_PAGE_PATH = '/login',
  SIGNUP_PAGE_PATH = '/signup',
  FORGOT_PASSWORD_PAGE_PATH = '/forgot-password',
  VERIFY_OTP_PAGE_PATH = '/verify-otp',
  RESET_PASSWORD_PAGE_PATH = '/reset-password',
  ADMIN_LOGIN_PATH = '/admin/login',
  EMAIL_VERIFICATION_PATH = '/email-verification',
  WORKS = '/works',
  NOT_FOUND = '*'
}

export enum PRIVATE_ROUTE {
  PLANS = '/plans',
  AUTH_CALLBACK_HANDLER = '/auth/callback-handler',
  DASHBOARD = '/dashboard',
  GIGS = '/gigs',
  USER_PROFILE = '/profile',
  USER_GIGS = '/manage-gigs',
  PROVIDER_BIDS = '/provider-bids',
  ADMIN_DASHBOARD_PATH = '/admin',
  ADMIN_USERS_DASHBOARD_PATH = '/admin/users',
  ADMIN_GIGS_DASHBOARD_PATH = '/admin/gigs',
  ADMIN_TIER_SYSTEM_DASHBOARD_PATH = '/admin/tier-system',
  ADMIN_SUBSCRIPTION_PLANS_DASHBOARD_PATH = '/admin/subscriptions',
  ADMIN_CMS_PATH = '/admin/cms'
}

export enum PUBLIC_API_ROUTES {
  SIGNUP_API = '/auth/signup',
  VERIFY_EMAIL_API = '/auth/verify-email',
  FORGOT_PASSWORD_API = '/auth/forgot-password',
  RESET_PASSWORD_API = '/auth/reset-password',
  API_FORGOT_PASSWORD = '/auth/forgot-password',
  WEBHOOK_PAYPAL = '/api/webhook/paypal',
  CMS_PARENT_API = 'cms',
  CMS_TYPE_API = 'cms/type',
  CMS_CONTENT_ID_API = 'cms/content_id',
  LANDING_PAGE_FAQS_LIST_API = 'faqs',
  CMS_STEPS_API = 'cms/type/step',
  GIGS_API = '/api/gigs',
  GIG_DETAIL_PUBLIC_API = '/api/public/gigs'
}

export enum PRIVATE_API_ROUTES {
  SUBSCRIPTION_PLANS_API = '/subscriptions/plans',
  SUBSCRIPTION_CREATE_API = '/subscriptions/subscribe'
}

export const excludedPublicRoutes = [
  PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH,
  PUBLIC_ROUTE.SIGNUP_PAGE_PATH,
  PUBLIC_ROUTE.FORGOT_PASSWORD_PAGE_PATH,
  PUBLIC_ROUTE.VERIFY_OTP_PAGE_PATH,
  PUBLIC_ROUTE.RESET_PASSWORD_PAGE_PATH,
  PUBLIC_ROUTE.EMAIL_VERIFICATION_PATH
];
