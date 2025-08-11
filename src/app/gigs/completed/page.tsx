'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import DashboardLayout from '@/components/layouts/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebouncedEffect } from '@/hooks/use-debounce';
import { RootState, useDispatch, useSelector } from '@/store/store';
import { gigService } from '@/services/gig.services';
import { PRIVATE_ROUTE } from '@/constants/app-routes';
import GigsShimmerCards from '@/components/shimmer/GigsShimmerCards';
import { GigCard, GigUserCard } from '../page';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ROLE } from '@prisma/client';

const CompletedGigsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const [search, setSearch] = useState('');

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGigId, setSelectedGigId] = useState('');

  const user = useSelector((state: RootState) => state.user);
  const { loading, completedProviderGigs, pagination, completedUserGigs } = useSelector((state: RootState) => state.gigs);

  const is_user_role = session?.user.role === ROLE.user || user?.role === ROLE.user;

  useEffect(() => {
    dispatch(gigService.clearGigs());
    return () => {
      dispatch(gigService.clearGigs());
    };
  }, [user?.role, dispatch]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const loadMore = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      if (is_user_role) {
        dispatch(
          gigService.getCompletedUserGigs({
            page: pagination.page + 1,
            search
          })
        );
      } else {
        dispatch(
          gigService.getCompletedProviderGigs({
            page: pagination.page + 1,
            search
          })
        );
      }
    }
  }, [pagination.page, pagination.totalPages, search]);

  useDebouncedEffect(
    () => {
      dispatch(gigService.clearGigs());
      setSearch('');
      setSelectedGigId('');
      setIsDeleteOpen(false);

      if (is_user_role) {
        dispatch(gigService.getCompletedUserGigs({ page: 1, search: '' }));
      } else {
        dispatch(gigService.getCompletedProviderGigs({ page: 1, search: '' }));
      }
    },
    500,
    [user?.role]
  );

  const handleSearch = () => {
    if (is_user_role) {
      dispatch(gigService.getCompletedUserGigs({ page: 1, search }));
    } else {
      dispatch(gigService.getCompletedProviderGigs({ page: 1, search }));
    }
  };

  const openDeleteConfirmation = (id: string) => {
    setSelectedGigId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const response = await dispatch(gigService.deleteGig(selectedGigId));
    if (response && response.data) {
      setIsDeleteOpen(false);
      setSelectedGigId('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-6">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Completed Gigs</h1>
          </div>

          <div className="mb-8 rounded-xl bg-gray-800/50 p-4 backdrop-blur-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative w-full">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 sm:left-4 sm:h-5 sm:w-5" />
                <Input
                  placeholder="Search gigs by keyword, skill, or category..."
                  className="w-full rounded-lg border-gray-700 bg-gray-700/50 py-4 pr-3 pl-10 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 sm:py-6 sm:pr-4 sm:pl-12 sm:text-base"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
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
                {(session?.user?.role === 'user' || user?.role === 'user') && (
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4 text-sm font-medium text-white hover:from-blue-500 hover:to-purple-500 sm:w-auto sm:px-6 sm:py-6 sm:text-base"
                    onClick={() => handleNavigation(PRIVATE_ROUTE.ADD_GIG)}
                  >
                    <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="sm:hidden">Create Gig</span>
                    <span className="hidden sm:inline">Create New Gig</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {is_user_role ? (
            <InfiniteScroll
              dataLength={completedUserGigs.length}
              next={loadMore}
              hasMore={pagination.page < pagination.totalPages}
              loader={<GigsShimmerCards />}
              scrollThreshold={0.9}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {completedUserGigs.map((gig, index) => (
                <GigUserCard
                  key={`${gig.id}-${index}`}
                  role={user?.role}
                  {...gig}
                  openDeleteConfirmation={openDeleteConfirmation}
                  is_completed={true}
                />
              ))}
              {loading && !isDeleteOpen && <GigsShimmerCards />}
            </InfiniteScroll>
          ) : (
            <InfiniteScroll
              dataLength={completedProviderGigs.length}
              next={loadMore}
              hasMore={pagination.page < pagination.totalPages}
              loader={<GigsShimmerCards />}
              scrollThreshold={0.9}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {completedProviderGigs.map((gig, index) => (
                <GigCard key={`${gig.id}-${index}`} role={user?.role} {...gig} is_completed={true} />
              ))}
              {loading && !isDeleteOpen && <GigsShimmerCards />}
            </InfiniteScroll>
          )}

          {completedProviderGigs.length === 0 && completedUserGigs.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-gray-800 p-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">No gigs found</h3>
              <p className="max-w-md text-gray-400">We couldn't find any gigs matching your search.</p>
              {is_user_role && (
                <Button
                  className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  onClick={() => handleNavigation(PRIVATE_ROUTE.ADD_GIG)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Gig
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
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

export default CompletedGigsPage;
