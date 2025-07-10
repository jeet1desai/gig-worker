'use client';

import { useRouter } from 'next/navigation';
import { Clock, DollarSign, Filter, Heart, MapPin, Plus, Search, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import DashboardLayout from '@/components/layouts/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import { RootState, useSelector } from '@/store/store';

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
  role?: 'user' | 'provider';
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
  role,
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
        {role === 'user' ? (
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Place Bid</Button>
        ) : (
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

const GigsPage = () => {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);

  const gigs = [
    {
      id: '1',
      title: 'Need help with calculus homework - derivatives and integrals',
      tier: 1,
      price: 10,
      providerName: 'John Doe',
      providerId: '1',
      rating: 4.5,
      reviewCount: 10,
      imageUrl: 'https://images.pexels.com/photos/31023938/pexels-photo-31023938.jpeg',
      deliveryTime: '3 Days',
      isFavorite: false,
      onFavoriteToggle: () => {},
    },
    {
      id: '1',
      title: 'Need help with calculus homework - derivatives and integrals',
      tier: 1,
      price: 10,
      providerName: 'John Doe',
      providerId: '1',
      rating: 4.5,
      reviewCount: 10,
      imageUrl: 'https://images.pexels.com/photos/31023938/pexels-photo-31023938.jpeg',
      deliveryTime: '3 Days',
      isFavorite: false,
      onFavoriteToggle: () => {},
    },
    {
      id: '1',
      title: 'Need help with calculus homework - derivatives and integrals',
      tier: 1,
      price: 10,
      providerName: 'John Doe',
      providerId: '1',
      rating: 4.5,
      reviewCount: 10,
      imageUrl: 'https://images.pexels.com/photos/31023938/pexels-photo-31023938.jpeg',
      deliveryTime: '3 Days',
      isFavorite: false,
      onFavoriteToggle: () => {},
    },
    {
      id: '1',
      title: 'Need help with calculus homework - derivatives and integrals',
      tier: 1,
      price: 10,
      providerName: 'John Doe',
      providerId: '1',
      rating: 4.5,
      reviewCount: 10,
      imageUrl: 'https://images.pexels.com/photos/31023938/pexels-photo-31023938.jpeg',
      deliveryTime: '3 Days',
      isFavorite: false,
      onFavoriteToggle: () => {},
    },
    {
      id: '1',
      title: 'Need help with calculus homework - derivatives and integrals',
      tier: 1,
      price: 10,
      providerName: 'John Doe',
      providerId: '1',
      rating: 4.5,
      reviewCount: 10,
      imageUrl: 'https://images.pexels.com/photos/31023938/pexels-photo-31023938.jpeg',
      deliveryTime: '3 Days',
      isFavorite: false,
      onFavoriteToggle: () => {},
    },
  ];

  return (
    <DashboardLayout>
      {user?.role === 'user' && (
        <main className="space-y-4 p-3 pl-5 sm:space-y-6 sm:p-4 md:p-6">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">Discover Gigs</h1>
              <p className="text-white">Browse and find the perfect gig for your needs</p>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-2 rounded-lg bg-gray-800/50 p-4">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                id="search"
                placeholder="Search gigs..."
                className="h-12 rounded-md border border-gray-600 pl-10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <Select>
              <SelectTrigger className="!h-12 w-[300px] rounded-md border border-gray-600 px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none">
                <SelectValue placeholder="Select a tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="1">Basic</SelectItem>
                <SelectItem value="2">Standard</SelectItem>
                <SelectItem value="3">Premium</SelectItem>
              </SelectContent>
            </Select>

            <Button
              size="lg"
              className="h-12 w-[120px] rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
            >
              <Filter className="size-4" /> Filter
            </Button>
          </div>

          <div className="w-full">
            {gigs.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                {gigs.map((gig: any) => {
                  return <GigCard key={gig.id} {...gig} role="user" />;
                })}
              </div>
            )}
          </div>
        </main>
      )}
      {user?.role === 'provider' && (
        <main className="space-y-4 p-3 pl-5 sm:space-y-6 sm:p-4 md:p-6">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">Post your gig request</h1>
              <p className="text-white">Post your gig request and get bids from freelancers</p>
            </div>

            <Button className="bg-gradient-to-r from-blue-600 to-purple-600" onClick={() => router.push('/gigs/new')}>
              <Plus className="h-4 w-4" />
              Create New Gig
            </Button>
          </div>

          <div className="w-full">
            {gigs.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                {gigs.map((gig: any) => {
                  return <GigCard key={gig.id} {...gig} role="provider" />;
                })}
              </div>
            )}
          </div>
        </main>
      )}
    </DashboardLayout>
  );
};

export default GigsPage;
