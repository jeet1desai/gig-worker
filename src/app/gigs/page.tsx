'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, DollarSign, MapPin, Plus, Search, Star, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from 'next/link';
import Image from 'next/image';

import DashboardLayout from '@/components/layouts/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { useDebouncedEffect } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date-format';
import { TIER } from '@prisma/client';

import { RootState, useDispatch, useSelector } from '@/store/store';
import { gigService } from '@/services/gig.services';

type GigProviderCardProps = any;

interface GigCardProps {
  id: string;
  title: string;
  description: string;
  tier: TIER;
  price_range: {
    min: number;
    max: number;
  };
  start_date: string;
  end_date: string;
  thumbnail: string;
  role?: 'user' | 'provider';
  user: {
    first_name: string;
    last_name: string;
    profile_url: string;
  };
}

const tierColors = {
  basic: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  expert: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
};

const tierLabels = {
  basic: 'basic',
  advanced: 'advanced',
  expert: 'expert'
};

export const GigCard = ({ id, title, description, tier, price_range, start_date, end_date, thumbnail, role, user }: GigCardProps) => {
  const router = useRouter();

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border ${'border-gray-700/50'} ${'bg-gray-800/50'} transition-all duration-300 ${'hover:border-gray-600 hover:shadow-gray-900/20'}`}
    >
      {thumbnail && (
        <div className="relative h-48 overflow-hidden">
          <Image src={thumbnail} alt={title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className={`${tierColors[tier]} border-2 font-medium capitalize backdrop-blur-sm`}>
              {tierLabels[tier]} Tier
            </Badge>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/gigs/${id}`} className="group-hover:text-blue-400">
              <h3 className="text-md mb-1 line-clamp-2 font-bold text-white capitalize transition-colors">{title}</h3>
            </Link>
            <p className="text-sm text-gray-400">
              ${price_range.min} - ${price_range.max}
            </p>
          </div>
        </div>

        <p className="mb-4 line-clamp-3 text-sm text-gray-300">{description}</p>

        <div className={cn('mt-auto grid gap-2 border-t border-gray-700/50 pt-4', role === 'user' ? 'grid-cols-2' : 'grid-cols-3')}>
          <div className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-900/30">
              <Clock className="size-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Delivery</p>
              <p className="text-xs text-white">{formatDate(end_date)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-900/30">
              <MapPin className="size-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Bids</p>
              <p className="text-xs text-white">1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-blue-500">
              <Image src={user.profile_url} alt={user.first_name} width={36} height={36} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user.first_name}</p>
              <div className="flex items-center space-x-1">
                <Star className="size-2 fill-amber-400 text-amber-400" />
                <span className="text-xs text-gray-400">1 (5)</span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => router.push(`/gigs/${id}`)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500"
          >
            Place Bid
          </Button>
        </div>
      </div>
    </div>
  );
};

export const GigProviderCard = ({
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
  role,
  isActive = false,
  activeStatus,
  bidCount = 0,
  averageBid = 0,
  highestBid = 0
}: GigProviderCardProps) => {
  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border ${isActive ? 'border-blue-500/50' : 'border-gray-700/50'} ${
        isActive ? 'bg-blue-900/10' : 'bg-gray-800/50'
      } transition-all duration-300 ${
        isActive ? 'hover:border-blue-400 hover:shadow-blue-500/20' : 'hover:border-gray-600 hover:shadow-gray-900/20'
      }`}
    >
      {isActive && <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400" />}
      {isActive && activeStatus && (
        <div className="absolute top-2 right-2 left-2 flex items-center gap-2 bg-gray-800/50 p-2 backdrop-blur-sm">
          <div className="flex-1">
            <Badge
              variant="outline"
              className={`px-3 py-1 text-xs font-medium ${
                activeStatus === 'accepted'
                  ? 'border-green-500/50 text-green-400'
                  : activeStatus === 'running'
                    ? 'border-yellow-500/50 text-yellow-400'
                    : 'border-emerald-500/50 text-emerald-400'
              }`}
            >
              {activeStatus === 'accepted' ? 'Accepted' : activeStatus === 'running' ? 'Running' : 'Completed'}
            </Badge>
          </div>
          {activeStatus === 'running' && (
            <div className="flex-1">
              <div className="flex items-center justify-end gap-2">
                <div className="h-2 w-20 rounded-full bg-gray-700/50">
                  <div className="h-2 w-12 rounded-full bg-blue-400" />
                </div>
                <span className="text-xs text-gray-400">60% Complete</span>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="relative h-48 overflow-hidden">
        <Image src={imageUrl} alt={title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute top-3 right-3">
          {/* <Badge variant="outline" className={`${tierColors[tier]} border-2 font-medium backdrop-blur-sm`}>
            {tierLabels[tier]} Tier
          </Badge> */}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/gigs/${id}`} className="group-hover:text-blue-400">
              <h3 className="text-md mb-1 line-clamp-2 font-bold text-white transition-colors">{title}</h3>
            </Link>
            <p className="text-sm text-gray-400">${price}</p>
          </div>
          <div className="flex items-center gap-2">
            {role === 'provider' && isActive && (
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                Active
              </Badge>
            )}
          </div>
        </div>

        <p className="mb-4 line-clamp-3 text-sm text-gray-300">
          {title === 'Need help with calculus homework - derivatives and integrals'
            ? 'I need help with understanding derivatives and integrals. The assignment is due in 2 days and I need someone who can explain the concepts clearly.'
            : title === 'Web Development for E-commerce Store'
              ? 'Looking for a skilled web developer to build an e-commerce store with modern UI and smooth checkout process.'
              : title === 'Mobile App UI/UX Design'
                ? 'Need a professional UI/UX designer to create an intuitive and user-friendly mobile app interface.'
                : 'Need help with calculus homework - derivatives and integrals'}
        </p>

        <div className={cn('mt-auto grid gap-2 border-t border-gray-700/50 pt-4', role === 'user' ? 'grid-cols-2' : 'grid-cols-3')}>
          <div className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-900/30">
              <Clock className="size-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Delivery</p>
              <p className="text-xs text-white">{deliveryTime}</p>
            </div>
          </div>
          {role === 'user' ? (
            <div className="flex items-center space-x-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-purple-900/30">
                <Star className="size-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-white">{rating}</span>
                  <span className="text-xs text-gray-400">({reviewCount})</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-blue-900/30">
                  <MapPin className="size-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Bids</p>
                  <p className="text-xs text-white">{bidCount}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-purple-900/30">
                  <DollarSign className="size-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Average Bid</p>
                  <p className="text-xs text-white">${averageBid}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-gray-700/50 p-4">
        <div className="flex items-center justify-between">
          {role === 'user' ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-blue-500">
                  <Image src={imageUrl} alt={providerName} width={36} height={36} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{providerName}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="size-2 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-gray-400">
                      {rating} ({reviewCount})
                    </span>
                  </div>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">Place Bid</Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {isActive && activeStatus === 'running' && (
                <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-900/20 hover:text-green-400">
                  Complete
                </Button>
              )}
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-900/20 hover:text-red-400">
                <Trash2 className="mr-2 h-4 w-4" /> Remove
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GigsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const [search, setSearch] = useState('');

  const user = useSelector((state: RootState) => state.user);
  const { gigs, pagination, ownGigs } = useSelector((state: RootState) => state.gigs);

  useEffect(() => {
    dispatch(gigService.clearGigs() as any);

    return () => {
      dispatch(gigService.clearGigs() as any);
    };
  }, [user?.role, dispatch]);

  const loadMore = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      if (session?.user.role === 'user' || user?.role === 'user') {
        dispatch(gigService.getOwnersGig({ page: pagination.page + 1, search }) as any);
      } else {
        dispatch(gigService.getGigs({ page: pagination.page + 1, search }) as any);
      }
    }
  }, [pagination.page, pagination.totalPages, search]);

  useDebouncedEffect(
    () => {
      dispatch(gigService.clearGigs() as any);
      setSearch('');
      if (session?.user.role === 'user' || user?.role === 'user') {
        dispatch(gigService.getOwnersGig({ page: 1, search: '' }) as any);
      } else {
        dispatch(gigService.getGigs({ page: 1, search: '' }) as any);
      }
    },
    500,
    [user?.role]
  );

  const handleSearch = () => {
    dispatch(gigService.clearGigs() as any);
    if (session?.user.role === 'user' || user?.role === 'user') {
      dispatch(gigService.getOwnersGig({ page: 1, search }) as any);
    } else {
      dispatch(gigService.getGigs({ page: 1, search }) as any);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          {session?.user.role === 'user' || user?.role === 'user' ? (
            <div className="mb-8 text-center">
              <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Create Your Next Gig</h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-300">
                Create and sell your services to clients worldwide. Grow your portfolio and earn money doing what you love.
              </p>
            </div>
          ) : (
            <div className="mb-8 text-center">
              <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Find Your Next Gig</h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-300">
                Discover and bid on exciting projects from clients worldwide. Grow your portfolio and earn money doing what you love.
              </p>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="mb-8 rounded-xl bg-gray-800/50 p-4 backdrop-blur-sm sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative w-full">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 sm:left-4 sm:h-5 sm:w-5" />
                <Input
                  placeholder="Search gigs by keyword, skill, or category..."
                  className="w-full rounded-lg border-gray-700 bg-gray-700/50 py-4 pr-3 pl-10 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 sm:py-6 sm:pr-4 sm:pl-12 sm:text-base"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4 text-sm font-medium text-white hover:from-blue-500 hover:to-purple-500 sm:w-auto sm:px-6 sm:py-6 sm:text-base"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Search
                </Button>

                {(session?.user?.role === 'user' || user?.role === 'user') && (
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4 text-sm font-medium text-white hover:from-blue-500 hover:to-purple-500 sm:w-auto sm:px-6 sm:py-6 sm:text-base"
                    onClick={() => router.push('/gigs/new')}
                  >
                    <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="sm:hidden">Create Gig</span>
                    <span className="hidden sm:inline">Create New Gig</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {session?.user.role === 'user' || user?.role === 'user' ? (
            <InfiniteScroll
              dataLength={ownGigs.length}
              next={loadMore}
              hasMore={pagination.page < pagination.totalPages}
              loader={<div className="col-span-2 py-4 text-center text-sm text-gray-400">Loading more gigs...</div>}
              scrollThreshold={0.9}
              className="grid grid-cols-1 gap-6 lg:grid-cols-2"
            >
              {ownGigs.map((gig, index) => (
                <GigCard key={`${gig.id}-${index}`} role={user?.role} {...gig} />
              ))}
            </InfiniteScroll>
          ) : (
            <InfiniteScroll
              dataLength={gigs.length}
              next={loadMore}
              hasMore={pagination.page < pagination.totalPages}
              loader={<div className="col-span-2 py-4 text-center text-sm text-gray-400">Loading more gigs...</div>}
              scrollThreshold={0.9}
              className="grid grid-cols-1 gap-6 lg:grid-cols-2"
            >
              {gigs.map((gig, index) => (
                <GigCard key={`${gig.id}-${index}`} role={user?.role} {...gig} />
              ))}
            </InfiniteScroll>
          )}

          {/* Empty State */}
          {gigs.length === 0 && ownGigs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-gray-800 p-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">No gigs found</h3>
              <p className="max-w-md text-gray-400">
                We couldn't find any gigs matching your search. Try adjusting your filters or check back later.
              </p>
              {(session?.user.role === 'user' || user?.role === 'user') && (
                <Button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => router.push('/gigs/new')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Gig
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GigsPage;
