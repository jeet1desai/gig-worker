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
