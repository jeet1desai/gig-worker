export const FREE_PLAN_ID = 'FREE-PLAN';

export const planBenefits: Record<string, string[]> = {
  [FREE_PLAN_ID]: [
    'Access as a User only',
    'Rate and review providers after gigs',
    'Only request a gig'
  ],
  'P-2CR825628R976200XNBV4CIY': [
    'Post up to 3 gigs/month',
    'Place up to 5 bids/month',
    'No access to “Top Rated Seller” badge'
  ],
  'P-8HB33956RE3059147NBV4CDY': [
    'Includes all Basic Plan features',
    'Unlimited gig postings and bids',
    'Eligible for Top Rated Seller badge'
  ]
};

export const FREE_PLAN = {
  plan_id: FREE_PLAN_ID,
  name: 'Free',
  description: 'Get started with essential features and explore our platform at no cost.',
  product_id: 'internal',
  price: 0,
  currency: 'USD',
  status: 'active',
  interval: 'MONTH',
  interval_count: 0,
  billing_cycle_count: 0,
  usage_type: 'INTERNAL',
  setup_fee: 0,
  type: 'free',
  tax_percentage: 0,
  merchant_id: 'system',
  isPublic: true,
  benefits: planBenefits['FREE-PLAN'],
  maxGigs: 0,
  maxBids: 0
};
