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

  return (
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
  );
};

export default GigCard;
