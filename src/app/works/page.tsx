'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, MapPin, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { gigService } from '@/services/gig.services';
import { RootState, useDispatch, useSelector } from '@/store/store';
import { getDaysBetweenDates } from '@/lib/date-format';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function WorksPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { gigs, pagination, loading } = useSelector((state: RootState) => state.gigs);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{ minPrice: string; maxPrice: string; deliveryTime: string }>({
    minPrice: '',
    maxPrice: '',
    deliveryTime: ''
  });

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const params: { page: number; search: string; limit: number } = {
          page: currentPage,
          search: '',
          limit: 10
        };

        dispatch(gigService.clearGigs() as any).then(() => {
          dispatch(gigService.getGigs(params) as any);
        });
      } catch (error) {
        console.error('Error fetching gigs:', error);
      }
    };

    fetchGigs();
  }, [dispatch, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery) return;

    setCurrentPage(1);
    const params: { page: number; search: string; limit: number } = {
      page: 1,
      search: searchQuery,
      limit: 10
    };

    dispatch(gigService.getGigs(params) as any);
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();

    if (!filters.minPrice && !filters.maxPrice && !filters.deliveryTime) return;

    setCurrentPage(1);
    setSearchQuery('');

    const params: { page: number; search: string; limit: number; minPrice?: string; maxPrice?: string; deliveryTime?: string } = {
      page: 1,
      search: '',
      limit: 10,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      deliveryTime: filters.deliveryTime
    };

    dispatch(gigService.getGigs(params) as any);
  };

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <Header />

      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-6 text-center text-4xl font-bold">Find the perfect freelance services for your business</h1>
          <form onSubmit={handleSearch} className="mx-auto max-w-3xl">
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="What service are you looking for today?"
                className="h-14 rounded-l-full bg-white/10 px-6 py-4 text-white placeholder-gray-300 backdrop-blur-sm focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-r-full bg-purple-600 px-8 py-4 text-white transition-colors hover:bg-purple-700"
              >
                <Search className="mr-2 h-5 w-5" /> Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row">
          <aside className="w-full md:w-1/4">
            <div className="sticky top-28 rounded-xl bg-black p-6">
              <form noValidate onSubmit={handleApplyFilters}>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <button className="text-gray-400 hover:text-white">
                    <Filter className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="mb-3 font-medium">Price Range</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="mb-1 block text-sm text-gray-400">Min ($)</Label>
                      <Input
                        type="number"
                        name="minPrice"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="mb-1 block text-sm text-gray-400">Max ($)</Label>
                      <Input
                        type="number"
                        name="maxPrice"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="mb-3 font-medium">Delivery Time</h3>
                  <Select value={filters.deliveryTime} onValueChange={(value) => setFilters((prev) => ({ ...prev, deliveryTime: value }))}>
                    <SelectTrigger className="w-full rounded-lg px-4 py-2 text-sm">
                      <SelectValue placeholder="Select a delivery time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Time</SelectItem>
                      <SelectItem value="24">Within 24 hours</SelectItem>
                      <SelectItem value="3">Within 3 days</SelectItem>
                      <SelectItem value="7">Within 7 days</SelectItem>
                      <SelectItem value="14">Within 14 days</SelectItem>
                      <SelectItem value="30">Within 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full rounded-lg bg-purple-600 px-4 py-1 text-white transition-colors hover:bg-purple-700">
                  {loading ? <Loader2 className="size-4 animate-spin" /> : 'Apply Filters'}
                </Button>
              </form>
            </div>
          </aside>

          <div className="w-full md:w-3/4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Available Gigs</h2>
              <div className="text-sm text-gray-400">
                Showing <span className="text-white">{gigs.length}</span> results
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-xl bg-black p-4">
                    <div className="mb-4 h-48 rounded-lg bg-gray-800"></div>
                    <div className="mb-2 h-4 w-3/4 rounded bg-gray-800"></div>
                    <div className="mb-4 h-3 w-1/2 rounded bg-gray-800"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-8 rounded-full bg-gray-800"></div>
                      <div className="h-3 w-16 rounded bg-gray-800"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : gigs.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {gigs.map((gig) => (
                  <div
                    key={gig.id}
                    className="cursor-pointer overflow-hidden rounded-xl bg-black transition-all duration-300"
                    onClick={() => router.push(`/works/${gig.id}`)}
                  >
                    <div className="relative">
                      <img src={gig.thumbnail} alt={gig.title} className="h-48 w-full object-cover" />
                      <div className="absolute top-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                        ${gig.price_range.min} - ${gig.price_range.max}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center">
                        <img src={gig.user.profile_url} alt={gig.user.first_name} className="mr-2 h-8 w-8 rounded-full" />
                        <div>
                          <h3 className="font-medium">
                            {gig.user.first_name} {gig.user.last_name}
                          </h3>
                          <div className="flex items-center text-xs text-gray-400">
                            <MapPin className="mr-1 h-3 w-3" />
                            {gig.location}
                          </div>
                        </div>
                      </div>

                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{gig.title}</h3>
                      <p className="mb-4 line-clamp-2 text-sm text-gray-400">{gig.description}</p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-yellow-400">
                          <Star className="mr-1 h-4 w-4" fill="currentColor" />
                          {gig.rating} ({gig.reviews})
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Clock className="mr-1 h-4 w-4" />
                          {getDaysBetweenDates(gig.start_date, gig.end_date)} days
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {gig.keywords.map((tag: string, i: number) => (
                          <span key={i} className="rounded bg-gray-800 px-2 py-1 text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <h3 className="mb-2 text-xl font-medium">No gigs found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}

            {pagination && pagination.total_pages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading}
                    className={`flex size-10 items-center justify-center rounded-lg p-2 transition-colors ${
                      currentPage === 1 || loading ? 'cursor-not-allowed bg-gray-800 text-gray-600' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <ChevronLeft className="size-6" />
                  </button>

                  {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                    let pageNum;
                    if (pagination.total_pages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                      if (i === 4) pageNum = pagination.total_pages;
                      else if (i === 3 && pagination.total_pages > 5) return '...';
                    } else if (currentPage >= pagination.total_pages - 2) {
                      if (i === 0) pageNum = 1;
                      else if (i === 1 && pagination.total_pages > 5) return '...';
                      else pageNum = pagination.total_pages - (4 - i);
                    } else {
                      if (i === 0) pageNum = 1;
                      else if (i === 1) return '...';
                      else if (i === 3) return '...';
                      else if (i === 4) pageNum = pagination.total_pages;
                      else pageNum = currentPage + (i - 2);
                    }

                    if (pageNum === '...') {
                      return (
                        <span key={`ellipsis-${i}`} className="flex h-10 w-10 items-center justify-center">
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(Number(pageNum))}
                        disabled={loading}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                          currentPage === pageNum ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(pagination.total_pages, prev + 1))}
                    disabled={currentPage === pagination.total_pages || loading}
                    className={`flex size-10 items-center justify-center rounded-lg p-2 transition-colors ${
                      currentPage === pagination.total_pages || loading
                        ? 'cursor-not-allowed bg-gray-800 text-gray-600'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
