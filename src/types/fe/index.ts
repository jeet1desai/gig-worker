import { GIG_STATUS, TIER } from '@prisma/client';

export interface SubscriptionPlan {
  id: number | string;
  plan_id: string;
  product_id: string;
  name: string;
  description: string;
  status: string;
  price: string;
  currency: string;
  interval: string;
  interval_count: number;
  billing_cycle_count: number;
  usage_type: string;
  setup_fee: string;
  tax_percentage: string;
  merchant_id: string;
  benefits: string[];
  isPublic: boolean;
  createdAt: string;
  lastSyncedAt: string;
  maxGigs: number;
  maxBids: number;
  subscriptionType: string;
  [key: string]: any;
}

export interface SubscriptionPlanResponse {
  success: boolean;
  data: SubscriptionPlan[];
  message: string;
  [key: string]: any;
}

export interface ApiResponse {
  message?: string;
  error?: {
    message?: string;
    fieldErrors?: {
      [key: string]: string;
    };
  };
}
export interface SubscriptionPlanPayload {
  id?: string;
  name: string;
  description: string;
  benefits: string[];
  price: string;
  maxGigs: number;
  maxBids: number;
  subscriptionType: string;
}
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isVisible: boolean;
}

export interface StepItem {
  id: string;
  title: string;
  description: string;
  color: string;
  order: number;
}

export interface HeroSectionData {
  title: string;
  description: string;
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  type: 'landing' | 'informative' | 'faqs' | '';
  isPublished: boolean;
  heroSection?: HeroSectionData;
  faqs?: FAQItem[];
  steps?: StepItem[];
  richContent?: string;
}

export interface CMSPageResponse {
  success: boolean;
  data: CMSPage[];
  message: string;
  [key: string]: any;
}

export interface FAQsHomeResponse {
  success: boolean;
  data: FAQItem[];
  message: string;
  [key: string]: any;
}

export interface StepsHomeResponse {
  success: boolean;
  data: StepItem[];
  message: string;
  [key: string]: any;
}
export interface AdminGigsResponse {
  success: boolean;
  data: {
    gigs: AdminGigsList[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
  [key: string]: any;
}

export interface AdminGigsSingleDataResponse {
  success: boolean;
  data: AdminGigsList;
  message: string;
  [key: string]: any;
}

export interface AdminGigsList {
  attachments: string[];
  completed_at: string | null;
  created_at: string;
  description: string;
  slug: string;
  end_date: string;
  id: string;
  is_removed: boolean;
  keywords: string[];
  location: string;
  pipeline: {
    id: string;
    status: GIG_STATUS;
    created_at: string;
    [key: string]: any;
  };
  price_range: {
    max: number;
    min: number;
    [key: string]: any;
  };
  start_date: string;
  thumbnail: string;
  tier: TIER;
  title: string;
  updated_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_url: string | null;
    _count: { gigs: number };
    [key: string]: any;
  };
  user_id: string;
  [key: string]: any;
}
