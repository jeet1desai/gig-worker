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

export interface CMSModuleResponse {
  success: boolean;
  data: ContentItem[];
  message: string;
  [key: string]: any;
}

export interface ContentItem {
  id: string;
  type: 'faq' | 'step' | 'contact' | 'terms' | 'privacy';
  title: string;
  description?: string;
  content: string;
  order?: number;
  isVisible: boolean;
  color?: string;
  [key: string]: any;
}

export type WorkingStepDirectionType = 'up' | 'down';
