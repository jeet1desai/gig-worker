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
export interface FAQsPayload {
  id?: string;
  question: string;
  answer: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  [key: string]: any;
}

export interface FAQsPlanResponse {
  success: boolean;
  data: FAQ[];
  message: string;
  [key: string]: any;
}

export interface WorkingStepPayload {
  id?: string;
  title: string;
  description: string;
  order: number;
}
export interface WorkingStep {
  id: string;
  title: string;
  description: string;
  order: number;
  color: string;
  [key: string]: any;
}
export interface WorkingStepsResponse {
  success: boolean;
  data: WorkingStep[];
  message: string;
  [key: string]: any;
}
