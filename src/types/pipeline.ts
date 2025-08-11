import { BID_STATUS, GIG_STATUS, PAYMENT_STATUS, TIER } from '@prisma/client';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_url?: string;
  is_verified: boolean;
  is_banned: boolean;
}

export interface GigPipeline {
  id: string;
  status: 'open' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  gig_id: string;
  provider_id: string;
  user_id: string;
  proposal: string;
  bid_price: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  provider: UserProfile;
  user: UserProfile;
}

export interface Gig {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  tier: TIER;
  price_range: {
    min: number;
    max: number;
  };
  keywords?: string[];
  completed_at?: string;
  thumbnail?: string;
  attachments?: string[];
  location?: string;
  is_removed: boolean;
  created_at: string;
  updated_at: string;
  user: UserProfile;
  pipeline?: GigPipeline;
  acceptedBid?: Bid[];
  rating?: number;
  status: GIG_STATUS;
  review_rating: {
    rating: number;
    review?: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
  };
  payment: {
    status: PAYMENT_STATUS;
    [key: string]: any;
  }[];
}

export interface ProviderBid {
  id: string;
  gig_id: string;
  provider_id: string;
  user_id: string;
  proposal: string;
  bid_price: number;
  status: BID_STATUS;
  created_at: string;
  updated_at: string;
  title: string;
  client: string;
  clientProfile: UserProfile;
  gigStatus: string;
  daysLeft?: number;
  gig: {
    id: string;
    title: string;
    slug: string;
    user: UserProfile;
    pipeline?: GigPipeline;
    review_rating: {
      rating: number;
      review?: string;
      created_at: string;
      updated_at: string;
      [key: string]: any;
    };
    payment: {
      status: PAYMENT_STATUS;
      [key: string]: any;
    }[];
  };
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserPipelineCounts {
  open: number;
  inProgress: number;
  completed: number;
}

export interface ProviderPipelineCounts {
  pending: number;
  accepted: number;
  rejected: number;
}

export interface UserPipeline {
  open: Gig[];
  inProgress: Gig[];
  completed: Gig[];
}

export interface ProviderPipelineResponse {
  data: {
    bids: ProviderBid[];
    pagination: Pagination;
    counts: ProviderPipelineCounts;
  };
}

export interface UserPipelineResponse {
  data: {
    gigs: Gig[];
    pagination: Pagination;
    counts: UserPipelineCounts;
  };
}
