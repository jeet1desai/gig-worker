import { BarChart3, Briefcase, PackagePlusIcon, Users2Icon, LayoutDashboard, PanelLeft, Globe, FileText, List, Share2 } from 'lucide-react';
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
  {
    name: 'Dashboard',
    icon: BarChart3,
    href: PRIVATE_ROUTE.DASHBOARD
  },
  { name: 'Gigs', icon: Briefcase, href: PRIVATE_ROUTE.GIGS },
  { name: 'Pipeline', icon: Share2, href: PRIVATE_ROUTE.GIG_PIPELINE_PATH }
];

export const ADMIN_DASHBOARD_NAVIGATION_MENU = [
  {
    name: 'Tier System',
    icon: LayoutDashboard,
    href: PRIVATE_ROUTE.ADMIN_TIER_SYSTEM_DASHBOARD_PATH
  },
  {
    name: 'Users',
    icon: Users2Icon,
    href: PRIVATE_ROUTE.ADMIN_USERS_DASHBOARD_PATH
  },
  {
    name: 'Gigs',
    icon: Briefcase,
    href: PRIVATE_ROUTE.ADMIN_GIGS_DASHBOARD_PATH
  },
  {
    name: 'Subscription Plans',
    icon: PackagePlusIcon,
    href: PRIVATE_ROUTE.ADMIN_SUBSCRIPTION_PLANS_DASHBOARD_PATH
  },
  {
    name: 'CMS Pages',
    icon: PanelLeft,
    href: PRIVATE_ROUTE.ADMIN_CMS_PAGES_PATH
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

export const USER_GIGS = [
  {
    id: '1',
    title: 'I will design a modern mobile app UI for your startup',
    price: 150,
    status: 'active' as const,
    tier: 'Expert',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'I will write your research paper and essays',
    price: 75,
    status: 'paused' as const,
    tier: 'Advanced',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=225&fit=crop',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'I will tutor you in computer science fundamentals',
    price: 45,
    status: 'active' as const,
    tier: 'Expert',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
    createdAt: '2024-01-08'
  },
  {
    id: '4',
    title: 'I will create social media content for your brand',
    description: 'Engaging social media posts, stories, and campaigns tailored for student entrepreneurs and small businesses.',
    price: 85,
    status: 'draft' as const,
    tier: 'Basic',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop',
    createdAt: '2024-01-05'
  }
];

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
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  GIG_NOT_FOUND: 'GIG_NOT_FOUND'
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
  USER_NOT_FOUND_MESSAGE: 'User not found.',
  SOMETHING_WENT_WRONG_MESSAGE: 'Something went wrong. Please try again later.',
  INVALID_REQUEST: 'Invalid request. Please check your input and try again.',
  UNAUTHORIZED: 'Unauthorized access. Please log in and try again.',
  EMAIL_NOT_EXISTS: 'User with this email does not exist.',
  INVALID_REQUEST_PAYLOAD: 'Invalid request payload',
  VALIDATION_ERROR: 'Validation error occurred. Please check your input.'
};

export const USER_ROLE = {
  success: 'User role updated successfully.',
  failure: 'Failed to update user role.',
  invalidRole: 'Invalid user role.',
  subscriptionRequired: 'User must have a Basic or Pro subscription to change profile view.'
};

export const GIGS_RATING_MESSAGES = {
  success: 'Rating submitted successfully.',
  failure: 'Failed to submit rating. Please try again.',
  GIG_NOT_FOUND: 'Gig not found. Please check the gig ID.',
  INVALID_RATING: 'Invalid rating. Rating must be between 1 and 5.',
  INVALID_COMMENT: 'Comment is too long. Maximum length is 500 characters.',
  RATING_UPDATED: 'Rating updated successfully.',
  RATING_CREATED: 'Rating created successfully.',
  DELETE_RATING: 'Rating deleted successfully.',
  RATING_FETCHED: 'Ratings fetched successfully.'
};

export const SUBSCRIPTION_PLAN_TYPES = ['free', 'basic', 'pro'];

export const ADMIN_ROLE = 'admin';

export const pageTypes = {
  landing: { label: 'Landing Page', icon: Globe, color: 'bg-blue-500' },
  informative: {
    label: 'Informative Page',
    icon: FileText,
    color: 'bg-green-500'
  },
  faqs: { label: 'FAQs', icon: List, color: 'bg-purple-500' }
};

export const publish_type = [
  { label: 'Published', value: true },
  { label: 'Draft', value: false }
];

export const working_steps = [
  {
    title: 'Create a Gig',
    description: "Payment is released to the freelancer once you're pleased and approve the work you get.",
    color: '#7B41FF'
  },
  {
    title: 'Deliver Great',
    description: "Find any service within minutes and know exactly what you'll pay. No hourly rates, just a fixed price.",
    color: '#0C9BFF'
  },
  {
    title: "We're Here For You 24/7",
    description: 'We here for you, anything from answering any questions to resolving any issues, at any time.',
    color: '#DF3699'
  },
  {
    title: 'Stay Updated',
    description: 'We are consisting of both creative thinkers and tech geniuses. We have the curiosity to explore new ideas',
    color: '#3CB66F'
  }
];

export const static_faqs = [
  {
    id: 'faq-1',
    question: 'How does it work?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 'faq-2',
    question: 'How can designers effectively seek out new opportunities?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 'faq-3',
    question: 'How do I Send Proposals?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 'faq-4',
    question: 'How can Clients find Designers?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 'faq-5',
    question: 'How Can I Join?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 'faq-6',
    question: 'What if I have more questions?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  }
];

export const tierColors: Record<string, string> = {
  basic: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  expert: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
};

export const tierLabels: Record<string, string> = {
  basic: 'basic',
  advanced: 'advanced',
  expert: 'expert'
};

export const statusColors: Record<string, string> = {
  open: 'bg-primary/10 text-primary border-primary/20',
  requested: 'bg-amber-100 text-amber-600 border-amber-300',
  in_progress: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  completed: 'border-green-300 bg-green-100 text-green-600',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20'
};

export const ratingLabels: Record<string, string> = {
  '1': 'Poor',
  '2': 'Fair',
  '3': 'Good',
  '4': 'Very Good',
  '5': 'Excellent'
};
