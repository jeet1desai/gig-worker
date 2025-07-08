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
  [key: string]: any;
}

export interface SubscriptionPlanResponse {
  success: boolean;
  data: SubscriptionPlan[];
  message: string;
  [key: string]: any;
}

export interface SubscriptionPlanPayload {
  id?: string;
  name: string;
  description: string;
  benefits: string[];
  price: string;
  maxGigs: number;
  maxBids: number;
}
