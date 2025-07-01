export enum PUBLIC_ROUTE {
  UNKNOWN = '#',
  HOME = '/',
  LOGIN = '/auth/login',
  SIGNUP = '/auth/signup',
  FORGOT_PASSWORD = '/auth/forgot-password',
  VERIFY_OTP = '/auth/verify-otp',
  RESET_PASSWORD = '/auth/reset-password',
  LANDING_PAGE = '/landingpage',
  ABOUT = '/about',
  NOT_FOUND = '*',
}

export enum PRIVATE_ROUTE {
  DASHBOARD = '/dashboard',
  USER_PROFILE = '/profile',
}

export enum PUBLIC_API_ROUTES {
  LOGIN_API = '/api/auth/login',
  SIGNUP_API = '/api/auth/signup',
  VERIFY_EMAIL_API = '/api/auth/verify-email',
  FORGOT_PASSWORD_API = '/api/auth/forgot-password',
  RESET_PASSWORD_API = '/api/auth/reset-password',
}
