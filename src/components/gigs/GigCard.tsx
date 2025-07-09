import Link from 'next/link';
import Image from 'next/image';
import { Clock, Heart, DollarSign, MapPin, Star } from 'lucide-react';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface GigCardProps {
  id: string;
  title: string;
  tier: 1 | 2 | 3;
  price: number;
  providerName: string;
  providerId: string;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  deliveryTime?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
}

const tierColors = {
  1: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  2: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  3: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const tierLabels = {
  1: 'Basic',
  2: 'Standard',
  3: 'Premium',
};

export const GigCard = ({
  id,
  title,
  tier,
  price,
  providerName,
  providerId,
  rating,
  reviewCount,
  imageUrl = '/placeholder-gig.jpg',
  deliveryTime = '3 Days',
  isFavorite = false,
  onFavoriteToggle,
}: GigCardProps) => {
  return (
    <div className="group relative w-full overflow-hidden rounded-xl border border-gray-700/50 transition-all duration-300 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/20">
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${tierColors[tier]} border font-medium`}>
              {tierLabels[tier]}
            </Badge>
            <Badge variant="outline" className={`${tierColors[tier]} border font-medium`}>
              {tierLabels[tier]}
            </Badge>
          </div>
          <Badge variant="outline" className={`${tierColors[tier]} border font-medium`}>
            {deliveryTime} Delivery
          </Badge>
        </div>
        <div className="mb-2 flex items-start justify-between">
          <Link href={`/gigs/${id}`} className="group-hover:text-blue-400">
            <h3 className="line-clamp-2 text-base font-semibold text-white transition-colors">{title}</h3>
          </Link>
        </div>
        <p className="mb-4 line-clamp-3 text-sm text-gray-300">
          I'm a college student struggling with my calculus assignment and need help understanding derivatives and integrals. The assignment is due in
          2 days and I really need someone who can explain the concepts clearly and help me solve the problems.
        </p>

        <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-teal-100 p-1.5 dark:bg-teal-900/30">
              <DollarSign className="size-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white">${price}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Fixed</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-purple-100 p-1.5 dark:bg-purple-900/30">
              <Clock className="size-4" />
            </div>
            <div>
              <span className="text-sm font-medium text-white">2 days</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Timeline</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-blue-100 p-1.5 dark:bg-blue-900/30">
              <Heart className="size-4" />
            </div>
            <div>
              <span className="text-sm font-medium text-white">8 bids</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Received</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-gray-100 p-1.5 dark:bg-gray-700">
              <MapPin className="size-4" />
            </div>
            <div>
              <span className="text-sm font-medium text-white">Remote</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-700/50 p-4">
        <div className="flex items-center">
          <div className="mr-3 h-8 w-8 overflow-hidden rounded-full bg-gray-700">
            <Image
              src="https://images.pexels.com/photos/31023938/pexels-photo-31023938.jpeg"
              alt={providerName}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4 text-sm font-medium text-white">
              <p>{providerName}</p>
            </div>
            <p className="flex items-center space-x-1 text-xs text-gray-500">
              <Star fill="currentColor" className="size-4 text-amber-600" /> <span>4.5</span> <span>•</span>{' '}
              <span className="font-medium">Top Rated Seller</span>
            </p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Place Bid</Button>
      </div>
    </div>
  );
};

export default GigCard;
