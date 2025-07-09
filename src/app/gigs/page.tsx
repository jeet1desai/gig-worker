'use client';

import { useRouter } from 'next/navigation';
import { Filter, Plus, Search } from 'lucide-react';

import { GigCard } from '@/components/gigs/GigCard';
import DashboardLayout from '@/components/layouts/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GigsPage = () => {
  const router = useRouter();

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
      <main className="space-y-4 p-3 pl-5 sm:space-y-6 sm:p-4 md:p-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Your Gig Dashboard</h1>
            <p className="text-white">Browse and find the perfect gig for your needs</p>
          </div>

          <Button className="bg-gradient-to-r from-blue-600 to-purple-600" onClick={() => router.push('/gigs/new')}>
            <Plus className="h-4 w-4" />
            Create New Gig
          </Button>
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
                return <GigCard key={gig.id} {...gig} />;
              })}
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default GigsPage;
