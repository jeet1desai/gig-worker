'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, Clock, DollarSign, Filter, Loader2, MapPin, Plus, Search, Star, Trash2, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from 'next/link';
import Image from 'next/image';

import DashboardLayout from '@/components/layouts/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

import { formatOnlyDate, getDaysBetweenDates } from '@/lib/date-format';
import { useDebouncedEffect } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { RootState, useDispatch, useSelector } from '@/store/store';
import { gigService } from '@/services/gig.services';
import { PRIVATE_ROUTE } from '@/constants/app-routes';
import GigsShimmerCards from '@/components/shimmer/GigsShimmerCards';

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

const tierOptions = [
  { value: 'basic', label: 'Basic' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
];

export const GigCard = ({ id, slug, title, description, tier, price_range, start_date, end_date, thumbnail, _count, user }: any) => {
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
            <Link href={`${PRIVATE_ROUTE.GIGS}/${slug}`} className="group-hover:text-blue-400">
              <h3 className="text-md mb-1 line-clamp-2 font-bold text-white capitalize transition-colors">{title}</h3>
            </Link>
            <p className="text-sm text-gray-400">
              ${price_range.min} - ${price_range.max}
            </p>
          </div>
        </div>

        <p className="mb-4 line-clamp-3 text-sm text-gray-300">{description}</p>

        <div className={cn('mt-auto grid gap-2 border-t border-gray-700/50 pt-4', 'grid-cols-3')}>
          <div className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-900/30">
              <Clock className="size-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Delivery</p>
              <p className="text-xs text-white">{formatOnlyDate(end_date)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-900/30">
              <MapPin className="size-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Bids</p>
              <p className="text-xs text-white">{_count.bids}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-900/30">
              <CalendarIcon className="size-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Timeline</p>
              <p className="text-xs text-white">{getDaysBetweenDates(start_date, end_date)} days</p>
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
            onClick={() => router.push(`${PRIVATE_ROUTE.GIGS}/${slug}`)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500"
          >
            Place Bid
          </Button>
        </div>
      </div>
    </div>
  );
};

export const GigUserCard = ({
  id,
  slug,
  title,
  description,
  tier,
  price_range,
  end_date,
  role,
  _count,
  isActive,
  activeStatus,
  openDeleteConfirmation
}: any) => {
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

      <div className="absolute top-3 right-3">
        <Badge variant="outline" className={`${tierColors[tier]} border-2 font-medium capitalize backdrop-blur-sm`}>
          {tierLabels[tier]} Tier
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <Link href={`${PRIVATE_ROUTE.GIGS}/${slug}`} className="group-hover:text-blue-400">
              <h3 className="text-md mb-1 line-clamp-2 font-bold text-white transition-colors">{title}</h3>
            </Link>
            <p className="text-sm text-gray-400">
              ${price_range.min} - ${price_range.max}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {role === 'user' && isActive && (
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                Active
              </Badge>
            )}
          </div>
        </div>

        <p className="mb-4 line-clamp-3 text-sm text-gray-300">{description}</p>

        <div className={cn('mt-auto grid gap-2 border-t border-gray-700/50 pt-4', 'grid-cols-3')}>
          <div className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-900/30">
              <Clock className="size-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Delivery</p>
              <p className="text-xs text-white">{formatOnlyDate(end_date)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-900/30">
              <MapPin className="size-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Bids</p>
              <p className="text-xs text-white">{_count.bids}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-purple-900/30">
              <DollarSign className="size-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Average Bid</p>
              <p className="text-xs text-white">$0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700/50 p-4">
        <div className="flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-2">
            {isActive && activeStatus === 'running' && (
              <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-900/20 hover:text-green-400">
                Complete
              </Button>
            )}
            <Button
              onClick={() => openDeleteConfirmation(id)}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-900/20 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<{
    tiers: string[];
    minPrice: string;
    maxPrice: string;
    rating: number;
    startDate: string;
    endDate: string;
  }>({
    tiers: [],
    minPrice: '',
    maxPrice: '',
    rating: 0,
    startDate: '',
    endDate: ''
  });
  const [activeFilters, setActiveFilters] = useState<
    Partial<{
      tiers: string[];
      minPrice: string;
      maxPrice: string;
      rating: number;
      startDate: string;
      endDate: string;
    }>
  >({});

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGigId, setSelectedGigId] = useState('');

  const user = useSelector((state: RootState) => state.user);
  const { loading, gigs, pagination, ownGigs } = useSelector((state: RootState) => state.gigs);

  useEffect(() => {
    dispatch(gigService.clearGigs() as any);
    return () => {
      dispatch(gigService.clearGigs() as any);
    };
  }, [user?.role, dispatch]);

  const loadMore = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      const filterParams = {
        ...(activeFilters.tiers?.length && { tiers: activeFilters.tiers }),
        ...(activeFilters.minPrice !== undefined &&
          activeFilters.minPrice !== '' && {
            minPrice: activeFilters.minPrice
          }),
        ...(activeFilters.maxPrice !== undefined &&
          activeFilters.maxPrice !== '' && {
            maxPrice: activeFilters.maxPrice
          }),
        ...(activeFilters.rating !== undefined && activeFilters.rating !== 0 && { rating: activeFilters.rating }),
        ...(activeFilters.startDate !== undefined &&
          activeFilters.startDate !== '' && {
            startDate: activeFilters.startDate
          }),
        ...(activeFilters.endDate !== undefined && activeFilters.endDate !== '' && { endDate: activeFilters.endDate })
      };

      if (session?.user.role === 'user' || user?.role === 'user') {
        dispatch(
          gigService.getOwnersGig({
            page: pagination.page + 1,
            search,
            ...filterParams
          }) as any
        );
      } else {
        dispatch(
          gigService.getGigs({
            page: pagination.page + 1,
            search,
            ...filterParams
          }) as any
        );
      }
    }
  }, [pagination.page, pagination.totalPages, search, activeFilters]);

  useDebouncedEffect(
    () => {
      dispatch(gigService.clearGigs() as any);
      setSearch('');
      setActiveFilters({});
      setFilters({
        tiers: [],
        minPrice: '',
        maxPrice: '',
        rating: 0,
        startDate: '',
        endDate: ''
      });

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
    const filterParams = {
      ...(activeFilters.tiers?.length && { tiers: activeFilters.tiers }),
      ...(activeFilters.minPrice !== undefined && activeFilters.minPrice !== '' && { minPrice: activeFilters.minPrice }),
      ...(activeFilters.maxPrice !== undefined && activeFilters.maxPrice !== '' && { maxPrice: activeFilters.maxPrice }),
      ...(activeFilters.rating !== undefined && activeFilters.rating !== 0 && { rating: activeFilters.rating }),
      ...(activeFilters.startDate !== undefined &&
        activeFilters.startDate !== '' && {
          startDate: activeFilters.startDate
        }),
      ...(activeFilters.endDate !== undefined && activeFilters.endDate !== '' && { endDate: activeFilters.endDate })
    };

    if (session?.user.role === 'user' || user?.role === 'user') {
      dispatch(gigService.getOwnersGig({ page: 1, search, ...filterParams }) as any);
    } else {
      dispatch(gigService.getGigs({ page: 1, search, ...filterParams }) as any);
    }
  };

  const handleApplyFilters = () => {
    const filterParams = {
      ...(filters.tiers?.length && { tiers: filters.tiers }),
      ...(filters.minPrice !== undefined && filters.minPrice !== '' && { minPrice: filters.minPrice }),
      ...(filters.maxPrice !== undefined && filters.maxPrice !== '' && { maxPrice: filters.maxPrice }),
      ...(filters.rating !== undefined && filters.rating !== 0 && { rating: filters.rating }),
      ...(filters.startDate !== undefined && filters.startDate !== '' && { startDate: filters.startDate }),
      ...(filters.endDate !== undefined && filters.endDate !== '' && { endDate: filters.endDate })
    };

    setActiveFilters((prev) => ({ ...prev, ...filterParams }));
    setIsFilterDialogOpen(false);

    if (session?.user.role === 'user' || user?.role === 'user') {
      dispatch(gigService.getOwnersGig({ page: 1, search, ...filterParams }) as any);
    } else {
      dispatch(gigService.getGigs({ page: 1, search, ...filterParams }) as any);
    }
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      tiers: [],
      minPrice: '',
      maxPrice: '',
      rating: 0,
      startDate: '',
      endDate: ''
    };
    setFilters(() => defaultFilters);
    setActiveFilters({});

    if (session?.user.role === 'user' || user?.role === 'user') {
      dispatch(gigService.getOwnersGig({ page: 1, search }) as any);
    } else {
      dispatch(gigService.getGigs({ page: 1, search }) as any);
    }
  };

  const toggleTier = (tier: string) => {
    const newTiers = filters.tiers.includes(tier) ? filters.tiers.filter((t) => t !== tier) : [...filters.tiers, tier];
    setFilters((prev) => ({ ...prev, tiers: newTiers }));
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, minPrice: e.target.value }));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, maxPrice: e.target.value }));
  };

  const handleRatingChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, rating: value[0] }));
  };

  const handleStartDateChange = (value: string) => {
    setFilters((prev) => ({ ...prev, startDate: value }));
  };

  const handleEndDateChange = (value: string) => {
    setFilters((prev) => ({ ...prev, endDate: value }));
  };

  const removeFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    let filterParams = { ...activeFilters };

    if (key === 'tiers') {
      if (value?.length) {
        filterParams.tiers = value;
      } else {
        delete filterParams.tiers;
      }
      setActiveFilters(filterParams);
    }

    if (key === 'minPrice') {
      const { minPrice, ...rest } = activeFilters;
      setActiveFilters(rest);
      delete filterParams.minPrice;
    }

    if (key === 'maxPrice') {
      const { maxPrice, ...rest } = activeFilters;
      setActiveFilters(rest);
      delete filterParams.maxPrice;
    }

    if (key === 'rating') {
      const { rating, ...rest } = activeFilters;
      setActiveFilters(rest);
      delete filterParams.rating;
    }

    if (key === 'startDate') {
      const { startDate, ...rest } = activeFilters;
      setActiveFilters(rest);
      delete filterParams.startDate;
    }

    if (key === 'endDate') {
      const { endDate, ...rest } = activeFilters;
      setActiveFilters(rest);
      delete filterParams.endDate;
    }

    if (session?.user.role === 'user' || user?.role === 'user') {
      dispatch(gigService.getOwnersGig({ page: 1, search, ...filterParams }) as any);
    } else {
      dispatch(gigService.getGigs({ page: 1, search, ...filterParams }) as any);
    }
  };

  const openDeleteConfirmation = (id: string) => {
    setSelectedGigId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const response = await dispatch(gigService.deleteGig(selectedGigId) as any);
    if (response && response.data) {
      setIsDeleteOpen(false);
      setSelectedGigId('');
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

          <div className="mb-8 rounded-xl bg-gray-800/50 p-4 backdrop-blur-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative w-full">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 sm:left-4 sm:h-5 sm:w-5" />
                <Input
                  placeholder="Search gigs by keyword, skill, or category..."
                  className="w-full rounded-lg border-gray-700 bg-gray-700/50 py-4 pr-3 pl-10 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 sm:py-6 sm:pr-4 sm:pl-12 sm:text-base"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4 text-sm font-medium text-white hover:from-blue-500 hover:to-purple-500 sm:w-auto sm:px-6 sm:py-6 sm:text-base"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Search
              </Button>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-4">
                <Button
                  size="lg"
                  variant={Object.keys(activeFilters).length > 0 ? 'default' : 'outline'}
                  className="relative w-full border-blue-500 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4 text-sm font-medium text-white hover:from-blue-500 hover:to-purple-500 sm:w-auto sm:px-6 sm:py-6 sm:text-base"
                  onClick={() => setIsFilterDialogOpen(true)}
                >
                  <Filter className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {Object.keys(activeFilters).length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600">
                      {Object.keys(activeFilters).length}
                    </span>
                  )}
                  Filter
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

          {Object.keys(activeFilters).length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-400">Filters:</span>
              {activeFilters.tiers?.map((tier: string) => (
                <div
                  key={`tier-${tier}`}
                  className="flex items-center gap-1 rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20"
                >
                  {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier
                  <X
                    className="size-4 cursor-pointer"
                    onClick={() => {
                      const newTiers = activeFilters.tiers?.filter((t: string) => t !== tier) || [];
                      removeFilter('tiers', newTiers);
                    }}
                  />
                </div>
              ))}

              {activeFilters?.minPrice !== undefined && activeFilters?.minPrice !== '' && (
                <div className="inline-flex">
                  <div className="flex items-center gap-1 rounded-md border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400 hover:bg-green-500/20">
                    Min Price: ${activeFilters?.minPrice}
                    <X className="size-3 cursor-pointer" onClick={() => removeFilter('minPrice', '')} />
                  </div>
                </div>
              )}

              {activeFilters?.maxPrice !== undefined && activeFilters?.maxPrice !== '' && (
                <div className="inline-flex">
                  <div className="flex items-center gap-1 rounded-md border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400 hover:bg-green-500/20">
                    Max Price: ${activeFilters?.maxPrice}
                    <X className="size-3 cursor-pointer" onClick={() => removeFilter('maxPrice', '')} />
                  </div>
                </div>
              )}

              {activeFilters?.rating !== undefined && activeFilters?.rating > 0 && (
                <div className="flex items-center gap-1 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-400 hover:bg-yellow-500/20">
                  {activeFilters.rating}+ Rating
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter('rating', 0)} />
                </div>
              )}

              {activeFilters.startDate !== undefined && activeFilters.startDate !== '' && (
                <div className="flex items-center gap-1 rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-400 hover:bg-purple-500/20">
                  Start Date: {formatOnlyDate(activeFilters.startDate)}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter('startDate', '')} />
                </div>
              )}

              {activeFilters.endDate !== undefined && activeFilters.endDate !== '' && (
                <div className="flex items-center gap-1 rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-400 hover:bg-purple-500/20">
                  End Date: {formatOnlyDate(activeFilters.endDate)}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter('endDate', '')} />
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-6 cursor-pointer text-xs text-blue-400 hover:bg-transparent hover:text-blue-300"
                onClick={handleResetFilters}
              >
                Clear all
              </Button>
            </div>
          )}

          {session?.user.role === 'user' || user?.role === 'user' ? (
            <InfiniteScroll
              dataLength={ownGigs.length}
              next={loadMore}
              hasMore={pagination.page < pagination.totalPages}
              loader={<GigsShimmerCards />}
              scrollThreshold={0.9}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {ownGigs.map((gig, index) => (
                <GigUserCard key={`${gig.id}-${index}`} role={user?.role} {...gig} openDeleteConfirmation={openDeleteConfirmation} />
              ))}
              {loading && !isDeleteOpen && <GigsShimmerCards />}
            </InfiniteScroll>
          ) : (
            <InfiniteScroll
              dataLength={gigs.length}
              next={loadMore}
              hasMore={pagination.page < pagination.totalPages}
              loader={<GigsShimmerCards />}
              scrollThreshold={0.9}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {gigs.map((gig, index) => (
                <GigCard key={`${gig.id}-${index}`} role={user?.role} {...gig} />
              ))}
              {loading && !isDeleteOpen && <GigsShimmerCards />}
            </InfiniteScroll>
          )}

          {gigs.length === 0 && ownGigs.length === 0 && !loading && (
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

      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen} modal>
        <DialogContent className="max-h-[90vh] overflow-auto border-[#374151] bg-[#1F2937] text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-white">Filter Gigs</DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-sm font-medium">Tier</h3>
                <div className="flex flex-wrap gap-2">
                  {tierOptions.map((tier) => (
                    <Badge
                      key={tier.value}
                      variant={filters.tiers.includes(tier.value) ? 'default' : 'outline'}
                      className={cn(
                        'w-24 cursor-pointer p-2 capitalize',
                        filters.tiers.includes(tier.value) ? 'bg-blue-600 text-gray-300 hover:bg-blue-700' : 'text-gray-300'
                      )}
                      onClick={() => toggleTier(tier.value)}
                    >
                      {tier.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium">Price Range</h3>
                  {filters.minPrice && filters.maxPrice && (
                    <div className="text-sm text-gray-400">
                      ${filters.minPrice} - ${filters.maxPrice}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" value={filters.minPrice} onChange={handleMinPriceChange} name="minPrice" placeholder="Min" />
                  <Input type="number" value={filters.maxPrice} onChange={handleMaxPriceChange} name="maxPrice" placeholder="Max" />
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium">Minimum Rating</h3>
                  <div className="text-sm text-gray-400">{filters.rating}+</div>
                </div>
                <Slider value={[filters.rating]} onValueChange={handleRatingChange} min={0} max={5} step={0.5} className="mb-2" />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>0</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full rounded-lg border-gray-700/50 bg-inherit px-4 py-2 text-left font-normal text-white hover:bg-inherit hover:text-white',
                            !filters.startDate && 'text-muted-foreground hover:text-muted-foreground'
                          )}
                        >
                          {filters.startDate ? formatOnlyDate(filters.startDate) : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          selected={filters.startDate ? new Date(filters.startDate) : undefined}
                          onSelect={(date: Date | undefined) => {
                            if (date) handleStartDateChange(date.toISOString());
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full rounded-lg border-gray-700/50 bg-inherit px-4 py-2 text-left font-normal text-white hover:bg-inherit hover:text-white',
                            !filters.endDate && 'text-muted-foreground hover:text-muted-foreground'
                          )}
                        >
                          {filters.endDate ? formatOnlyDate(filters.endDate) : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          selected={filters.endDate ? new Date(filters.endDate) : undefined}
                          onSelect={(date: Date | undefined) => {
                            if (date) handleEndDateChange(date.toISOString());
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button className="border bg-inherit text-gray-400 hover:bg-transparent hover:text-gray-300" onClick={handleResetFilters}>
                  Reset Filters
                </Button>
                <Button onClick={handleApplyFilters}>Apply Filters</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="border-slate-700 bg-slate-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Gig</DialogTitle>
            <DialogDescription>Are you sure you want to delete this gig? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="">
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="cursor-pointer border border-white dark:border-white dark:text-white">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" className="cursor-pointer bg-[#5750F1] text-white" onClick={handleDeleteConfirm}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default GigsPage;
