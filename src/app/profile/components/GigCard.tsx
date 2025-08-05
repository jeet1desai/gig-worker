'use client';

import Link from 'next/link';
import { format, isThisYear, parseISO } from 'date-fns';
import { Clock, DollarSign, MapPin } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/date-format';
import { capitalizeWords, cn, formatCurrency } from '@/lib/utils';

interface GigCardProps {
  id: string;
  title: string;
  description: string;
  tier: any;
  price_range: { min: number; max: number };
  end_date: string;
  bids: { bid_price: number }[];
  isActive?: boolean;
  activeStatus: 'accepted' | 'running' | 'completed';
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

const GigCard = ({ id, title, description, tier, price_range, end_date, bids, isActive, activeStatus }: GigCardProps) => {
  const getAverageBidsPrice = () => {
    if (bids.length === 0) return 0;
    const total = bids.reduce((sum, bid) => sum + bid.bid_price, 0);
    return formatCurrency(total / bids.length, 'USD');
  };

  const formatDeliveryDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    const dateFormat = isThisYear(date) ? 'MMM d · h:mm a' : 'MMM d, yyyy · h:mm a';
    return format(date, dateFormat);
  };

  const gig = {
    id: 1,
    title: 'React Admin Dashboard',
    description: 'Build a fully responsive admin panel using React and Tailwind CSS.',
    tier: 'basic',
    price_range: [100, 300],
    keywords: ['React', 'Tailwind', 'Dashboard'],
    start_date: '2025-07-25T12:00:00Z',
    end_date: '2025-08-01T00:00:00Z',
    completed_at: '2025-08-03T15:30:00Z',
    bids: [{ bid_price: 125 }],
    location: 'India',
    review_rating: {
      rating: 4.8,
      review: 'Great delivery and communication!'
    },
    user: {
      name: 'John D.',
      country: 'India',
      image: '' // optional avatar
    }
  };

  const averageBid = gig.bids.reduce((sum, b) => sum + Number(b.bid_price), 0) / gig.bids.length;
  const deliveryDate = new Date(gig.end_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  const completionDate = new Date(gig.completed_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <>
      <div
        className={cn(
          'group flex w-full flex-col overflow-hidden rounded-xl border transition-all duration-300',
          'border-gray-700/50 bg-gray-800/50 hover:border-gray-600 hover:shadow-gray-900/20'
        )}
      >
        <div className="m-3 flex items-center justify-between gap-2 bg-gray-800/50 p-2 backdrop-blur-sm">
          <div>
            <Badge variant="outline" className={cn('px-3 py-1 text-xs font-medium', statusColors[activeStatus])}>
              {capitalizeWords(activeStatus)}
            </Badge>
          </div>
          {activeStatus === 'running' && (
            <div className="flex-1">
              <div className="flex items-center justify-end gap-2">
                <div className="h-2 w-24 rounded-full bg-gray-700/50">
                  <div className="h-2 w-16 rounded-full bg-blue-400" />
                </div>
                <span className="text-xs text-gray-400">60% Complete</span>
              </div>
            </div>
          )}
          <div>
            <Badge variant="outline" className={cn('border-2 font-medium capitalize backdrop-blur-sm', tierColors[tier])}>
              {tierLabels[tier]} Tier
            </Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col space-y-4 p-6 pt-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link href={`/gigs/${id}`} className="group-hover:text-blue-400">
                <h3 className="line-clamp-2 text-lg font-bold text-white transition-colors">{title}</h3>
              </Link>
              <p className="text-sm text-gray-400">
                ${price_range.min} - ${price_range.max}
              </p>
            </div>
          </div>

          <p title={description} className="line-clamp-3 text-sm text-gray-300">
            {description}
          </p>

          <div className="grid grid-cols-3 gap-4 border-t border-gray-700/50 pt-4">
            <div className="flex items-center space-x-2">
              <div className="flex size-9 items-center justify-center rounded-full bg-blue-900/30">
                <Clock className="size-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Delivery</p>
                <p className="text-sm text-white">{formatDeliveryDate(end_date)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex size-9 items-center justify-center rounded-full bg-blue-900/30">
                <MapPin className="size-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Bids</p>
                <p className="text-sm text-white">{bids.length || 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex size-9 items-center justify-center rounded-full bg-purple-900/30">
                <DollarSign className="size-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Average Bid</p>
                <p className="text-sm text-white">{getAverageBidsPrice()}</p>
              </div>
            </div>
          </div>
        </div>

        {isActive && activeStatus === 'running' && (
          <div className="flex items-center justify-end gap-2 border-t border-gray-700/50 p-4">
            <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-900/20 hover:text-green-400">
              Complete
            </Button>
          </div>
        )}
      </div>
      <div className="min-h-screen bg-black p-6 text-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700/50 bg-gray-900 p-6 text-white shadow-md transition-all hover:border-gray-600">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-green-700 px-3 py-1 text-sm font-medium text-white">Completed</span>
              <span className="rounded border border-blue-500 px-2 py-1 text-sm text-blue-500 capitalize">{gig.tier} Tier</span>
            </div>

            {/* Title & Price */}
            <h2 className="mb-1 text-xl font-bold">{gig.title}</h2>
            <p className="mb-2 text-sm text-gray-400">
              ${gig.price_range[0]} - ${gig.price_range[1]}
            </p>
            <p className="mb-4 text-sm text-gray-300">{gig.description}</p>

            {/* Tags */}
            <div className="mb-4 flex flex-wrap gap-2">
              {gig.keywords.map((tag, i) => (
                <span key={i} className="rounded bg-slate-800 px-2 py-1 text-xs text-gray-300">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-700 pt-4 text-sm text-gray-400">
              <div>
                <p className="text-xs">Delivery</p>
                <p className="font-medium text-white">{deliveryDate}</p>
              </div>
              <div>
                <p className="text-xs">Completed</p>
                <p className="font-medium text-white">{completionDate}</p>
              </div>
              <div>
                <p className="text-xs">Avg. Bid</p>
                <p className="font-medium text-white">${averageBid.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-xs">Bids</p>
                <p className="font-medium text-white">{gig.bids.length}</p>
              </div>
            </div>

            {/* Review */}
            {gig.review_rating && (
              <div className="mt-4 border-t border-gray-700 pt-4 text-sm">
                <p className="flex items-center gap-2 text-yellow-400">
                  <i className="fa fa-star" />
                  {gig.review_rating.rating}/5
                </p>
                <p className="mt-2 text-gray-300 italic">"{gig.review_rating.review}"</p>
              </div>
            )}

            {/* Client Info */}
            <div className="mt-6 flex items-center gap-3 border-t border-gray-700 pt-4 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-xs font-semibold text-white">
                {gig.user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <p className="font-medium text-white">{gig.user.name}</p>
                <p className="text-xs text-gray-400">{gig.user.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GigCard;
