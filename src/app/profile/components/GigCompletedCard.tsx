'use client';

import Link from 'next/link';
import { format, isThisYear, parseISO } from 'date-fns';
import { Clock, DollarSign, MapPin } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/date-format';
import { capitalizeWords, cn, formatCurrency } from '@/lib/utils';
import moment from 'moment';
import { getInitials } from './EditProfilePhotoModal';
import TagList from './TagList';

interface Bid {
  bid_price: number;
}

interface PriceRange {
  max: number;
  min: number;
}

interface Count {
  bids: number;
}

interface Pipeline {
  id: string;
  gig_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  profile_url: string;
}

interface Review {
  rating: number;
  rating_feedback: string;
}

interface Gig {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  tier: string;
  price_range: PriceRange;
  keywords: string[];
  completed_at: string | null;
  thumbnail: string;
  attachments: any[];
  location: string;
  is_removed: boolean;
  created_at: string;
  updated_at: string;
  _count: Count;
  bids: Bid[];
  pipeline: Pipeline;
  user: User;
  review_rating: Review;
}

const statusColors: Record<string, string> = {
  open: 'text-blue-400 border-blue-500/20',
  requested: 'text-indigo-400 border-indigo-500/20',
  in_progress: 'text-yellow-400 border-yellow-500/20',
  completed: 'text-green-400 border-green-500/20',
  rejected: 'text-red-400 border-red-500/20'
};

const tierColors: Record<string, string> = {
  basic: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  expert: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
};

const tierLabels: Record<string, string> = {
  basic: 'basic',
  advanced: 'advanced',
  expert: 'expert'
};

const GigCompletedCard = ({
  _count,
  bids,
  completed_at,
  description,
  end_date,
  keywords,
  location,
  user,
  review_rating,
  pipeline,
  price_range,
  start_date,
  tier,
  title
}: Gig) => {
  const getAverageBidsPrice = () => {
    if (bids.length === 0) return 0;
    const total = bids.reduce((sum, bid) => sum + bid.bid_price, 0);
    return formatCurrency(total / bids.length, 'USD');
  };

  const initials = getInitials(user.first_name!, user.last_name!);

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-gray-900 p-6 text-white shadow-md transition-all hover:border-gray-600">
      <div className="mb-3 flex items-center justify-between">
        <Badge variant="outline" className={cn('px-3 py-1 text-xs font-medium capitalize', statusColors[pipeline.status])}>
          {pipeline.status}
        </Badge>
        <Badge variant="outline" className={cn('border-2 font-medium capitalize backdrop-blur-sm', tierColors[tier])}>
          {tierLabels[tier]} Tier
        </Badge>
      </div>

      <h2 className="mb-1 text-xl font-bold">{title}</h2>
      <p className="mb-2 text-sm text-gray-400">
        ${price_range.min} - ${price_range.max}
      </p>
      <p className="mb-4 text-sm text-gray-300">{description}</p>

      {/* <div className="mb-4 flex flex-wrap gap-2">
        {(Array.isArray(keywords) ? keywords : []).map((tag, i) => (
          <span key={i} className="rounded bg-slate-800 px-2 py-1 text-xs text-gray-300">
            #{tag}
          </span>
        ))}
      </div> */}
      <TagList keywords={keywords} />

      <div className="grid grid-cols-2 gap-4 border-t border-gray-700 pt-4 text-sm text-gray-400">
        <div>
          <p className="text-xs">Delivery</p>
          <p className="font-medium text-white">{moment(end_date).format('ddd, MMM DD YYYY')}</p>
        </div>
        <div>
          <p className="text-xs">Completed</p>
          <p className="font-medium text-white">{completed_at && moment(completed_at).format('ddd, MMM DD YYYY')}</p>
        </div>
        <div>
          <p className="text-xs">Avg. Bid</p>
          <p className="font-medium text-white">{getAverageBidsPrice()}</p>
        </div>
        <div>
          <p className="text-xs">Bids</p>
          <p className="font-medium text-white">{_count.bids}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-700 pt-4 text-sm">
        <p className="flex items-center gap-2 text-yellow-400">
          <i className="fa fa-star" />
          {review_rating?.rating ?? 0}/5
        </p>
        <p className="mt-2 text-gray-300 italic">{review_rating?.rating_feedback ? `"${review_rating.rating_feedback}"` : `-`}</p>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-gray-700 pt-4 text-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-xs font-semibold text-white">{initials}</div>
        <div>
          <p className="font-medium text-white">
            {user.first_name} {user.last_name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GigCompletedCard;
