'use client';
import { useCallback, useEffect, useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminGigCard } from './AdminGigCard';
import apiService from '@/services/api';
import { AdminGigsList, AdminGigsResponse, AdminGigsSingleDataResponse } from '@/types/fe';
import { PRIVATE_API_ROUTES } from '@/constants/app-routes';
import { DEFAULT_PAGINATION, tierLabels } from '@/constants';
import { toast } from '@/lib/toast';
import { useDebouncedEffect } from '@/hooks/use-debounce';
import Loader from '@/components/Loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GIG_STATUS } from '@prisma/client';
import CommonDeleteDialog from '@/components/CommonDeleteDialog';

export default function GigManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [adminGigsList, setAdminGigsList] = useState<AdminGigsList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedGigId, setSelectedGigId] = useState<string>('');
  const [filters, setFilters] = useState<{
    tiers: string[];
    minPrice: string;
    maxPrice: string;
    rating: number;
    status: string;
  }>({
    tiers: [],
    minPrice: '',
    maxPrice: '',
    rating: 0,
    status: 'all'
  });
  const [activeFilters, setActiveFilters] = useState<
    Partial<{
      tiers: string[];
      minPrice: string;
      maxPrice: string;
      rating: number;
      status: string;
    }>
  >({});

  useDebouncedEffect(
    () => {
      getAllAdminGigsList();
    },
    500,
    [pagination.page, searchTerm, activeFilters]
  );

  const buildQueryParams = (query: Record<string, string | number | boolean | null | undefined | (string | number | boolean)[]>) => {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    return params.toString();
  };

  useEffect(() => {
    if (Object.keys(activeFilters)) {
      setAdminGigsList([]);
      setPagination(DEFAULT_PAGINATION);
    }
  }, [activeFilters, searchTerm]);

  const getAllAdminGigsList = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = buildQueryParams({
        page: pagination?.page,
        pageSize: pagination?.pageSize,
        search: searchTerm,
        minPrice: activeFilters?.minPrice,
        maxPrice: activeFilters?.maxPrice,
        rating: activeFilters?.rating,
        status: activeFilters?.status !== 'all' ? activeFilters?.status : undefined,
        tiers: activeFilters?.tiers
      });

      const response = await apiService.get<AdminGigsResponse>(`${PRIVATE_API_ROUTES.ADMIN_GIGS_LIST_API}?${queryParams}`, { withAuth: true });

      if (response.data.success && response.data.data.gigs && response.data.data.pagination) {
        setAdminGigsList((prev) => [...prev, ...response.data.data.gigs]);
        setPagination(response.data.data.pagination);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.message || 'Failed to fetch gigs';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [pagination?.page, pagination?.pageSize, searchTerm, activeFilters]);

  const handleConfirmDeleteGig = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.delete<AdminGigsSingleDataResponse>(`${PRIVATE_API_ROUTES.ADMIN_GIGS_LIST_API}/${selectedGigId}`, {
        withAuth: true
      });

      if (response.data.success && response.data.message && response.data.data) {
        const filtered_gigs = adminGigsList.filter((gig) => gig.id !== response.data.data.id);
        setAdminGigsList(filtered_gigs);
        setSelectedGigId('');
        toast.success(response.data.message);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.message || 'Error deleting gig';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [selectedGigId]);

  const handleUpdateGigStatus = async (id: string, status: GIG_STATUS) => {
    setLoading(true);
    try {
      const response = await apiService.patch<AdminGigsSingleDataResponse>(
        `${PRIVATE_API_ROUTES.ADMIN_GIGS_LIST_API}/${id}`,
        { status: status },
        {
          withAuth: true
        }
      );

      if (response.data.success && response.data.message && response.data.data) {
        const updatedGig = response.data.data;

        const updatedGigsList = adminGigsList.map((gig) => {
          return gig.id === updatedGig.id ? updatedGig : gig;
        });

        setAdminGigsList(updatedGigsList);
        toast.success(response.data.message);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.message || 'Error updating gig';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
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

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  const removeFilter = (key: string, value: string | number | string[] | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    let filterParams = { ...activeFilters };

    if (key === 'tiers') {
      if (Array.isArray(value) && value.length) {
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

    if (key === 'status') {
      const { status, ...rest } = activeFilters;
      setActiveFilters(rest);
      delete filterParams.status;
    }
  };

  const handleApplyFilters = () => {
    const filterParams = {
      ...(filters.tiers?.length && { tiers: filters.tiers }),
      ...(filters.minPrice !== undefined && filters.minPrice !== '' && { minPrice: filters.minPrice }),
      ...(filters.maxPrice !== undefined && filters.maxPrice !== '' && { maxPrice: filters.maxPrice }),
      ...(filters.rating !== undefined && filters.rating !== 0 && { rating: filters.rating }),
      ...(filters.status !== undefined && filters.status !== 'all' && { status: filters.status })
    };

    setActiveFilters((prev) => ({ ...prev, ...filterParams }));
    setIsFilterDialogOpen(false);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      tiers: [],
      minPrice: '',
      maxPrice: '',
      rating: 0,
      status: 'all'
    };
    setFilters(() => defaultFilters);
    setActiveFilters({});
  };

  const formatLabel = (status: string) => status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const onAdminGigDelete = (id: string) => {
    setIsDeleteOpen(true);
    setSelectedGigId(id);
  };
  return (
    <div className="space-y-6">
      <Loader isLoading={loading} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-lg font-bold text-white sm:text-xl md:text-2xl lg:text-3xl">Gigs Management</h1>
          <p className="text-xs text-slate-400 sm:text-sm md:text-base lg:text-lg">Manage your gigs and track thier progress</p>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search gigs, clients, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              className="relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700"
              onClick={() => setIsFilterDialogOpen(true)}
            >
              <Filter className="h-4 w-4" />
              {Object.keys(activeFilters).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600">
                  {Object.keys(activeFilters).length}
                </span>
              )}
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

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

          {activeFilters.status !== undefined && activeFilters.status !== '' && (
            <div className="flex items-center gap-1 rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-400 hover:bg-purple-500/20">
              {formatLabel(activeFilters.status)} status
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter('status', '')} />
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs text-blue-400 hover:bg-transparent hover:text-blue-300"
            onClick={handleResetFilters}
          >
            Clear all
          </Button>
        </div>
      )}

      <InfiniteScroll
        dataLength={adminGigsList.length}
        next={loadMore}
        hasMore={pagination.page < pagination.totalPages}
        loader={<Loader isLoading={loading} />}
        scrollThreshold={0.9}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {adminGigsList.map((gig) => (
          <AdminGigCard key={gig.id} gig_details={gig} onDelete={onAdminGigDelete} onUpdate={handleUpdateGigStatus} />
        ))}
      </InfiniteScroll>

      {adminGigsList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-gray-800 p-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-white">No gigs found</h3>
          <p className="max-w-md text-gray-400">We couldn't find any gigs matching your search. Try adjusting your filters or check back later.</p>
        </div>
      )}

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
                  {Object.values(tierLabels).map((tier) => (
                    <Badge
                      key={tier}
                      variant={filters.tiers.includes(tier) ? 'default' : 'outline'}
                      className={cn(
                        'w-24 cursor-pointer p-2 capitalize',
                        filters.tiers.includes(tier) ? 'bg-blue-600 text-gray-300 hover:bg-blue-700' : 'text-gray-300'
                      )}
                      onClick={() => toggleTier(tier)}
                    >
                      {formatLabel(tier)}
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
                <Label htmlFor="min-status" className="mb-2 block text-sm font-medium">
                  Status
                </Label>
                <Select value={filters.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.values(GIG_STATUS).map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatLabel(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
      {isDeleteOpen && (
        <CommonDeleteDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onConfirm={handleConfirmDeleteGig}
          title="Delete Gig"
          description="Are you sure you want to delete this gig? This action cannot be undone."
        />
      )}
    </div>
  );
}
