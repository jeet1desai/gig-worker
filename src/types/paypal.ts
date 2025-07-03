export interface PayPalPlansResponse {
  plans: PayPalPlan[];
  total_items: string;
  total_pages: string;
  links?: any[];
}

export interface PayPalPlan {
  id: string;
  version: number;
  product_id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  description: string;
  usage_type: 'LICENSED' | 'UNLICENSED';
  billing_cycles: BillingCycle[];
  payment_preferences: PaymentPreferences;
  taxes: Taxes;
  quantity_supported: boolean;
  payee: Payee;
  create_time: string;
  update_time: string;
  links: PayPalLink[];
}

export interface BillingCycle {
  pricing_scheme: PricingScheme;
  frequency: Frequency;
  tenure_type: 'TRIAL' | 'REGULAR';
  sequence: number;
  total_cycles: number;
}

export interface PricingScheme {
  version: number;
  fixed_price: CurrencyValue;
  create_time: string;
  update_time: string;
}

export interface CurrencyValue {
  currency_code: string;
  value: string;
}

export interface Frequency {
  interval_unit: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  interval_count: number;
}

export interface PaymentPreferences {
  service_type: 'PREPAID' | 'POSTPAID';
  auto_bill_outstanding: boolean;
  setup_fee: CurrencyValue;
  setup_fee_failure_action: 'CONTINUE' | 'CANCEL';
  payment_failure_threshold: number;
}

export interface Taxes {
  percentage: string;
  inclusive: boolean;
}

export interface Payee {
  merchant_id: string;
  display_data: DisplayData;
}

export interface DisplayData {
  business_email: string;
  business_phone: BusinessPhone;
}

export interface BusinessPhone {
  country_code: string;
  national_number: string;
}

export interface PayPalLink {
  href: string;
  rel: string;
  method: string;
  encType?: string;
}

export interface CreateSubscriptionPayload {
  plan_id: string;
  custom_id: string;
  subscriber?: {
    name?: {
      given_name?: string;
      surname?: string;
    };
    email_address?: string;
    shipping_address?: {
      name?: {
        full_name?: string;
      };
      address?: {
        address_line_1: string;
        address_line_2?: string;
        admin_area_2: string;
        admin_area_1: string;
        postal_code: string;
        country_code: string;
      };
    };
  };
  application_context?: {
    locale?: string;
    shipping_preference?: 'GET_FROM_FILE' | 'NO_SHIPPING' | 'SET_PROVIDED_ADDRESS';
    user_action?: 'SUBSCRIBE_NOW' | 'CONTINUE';
    brand_name?: string;
    payment_method?: {
      payer_selected?: 'PAYPAL' | 'VENMO' | 'PAY_UPON_INVOICE';
      payee_preferred?: 'UNRESTRICTED' | 'IMMEDIATE_PAYMENT_REQUIRED';
    };
    return_url: string;
    cancel_url: string;
  };
}
