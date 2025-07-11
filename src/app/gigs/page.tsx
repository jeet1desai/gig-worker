'use client';

import { useRouter } from 'next/navigation';
import {
  Clock,
  DollarSign,
  Filter,
  Heart,
  MapPin,
  Plus,
  Search,
  Star,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import DashboardLayout from '@/components/layouts/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
  3: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
};

const tierLabels = {
  1: 'Basic',
  2: 'Standard',
  3: 'Premium'
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
  role
}: GigCardProps) => {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/50 transition-all duration-300 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/20">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge
            variant="outline"
            className={`${tierColors[tier]} border-2 font-medium backdrop-blur-sm`}
          >
            {tierLabels[tier]} Tier
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between">
          <Link href={`/gigs/${id}`} className="group-hover:text-blue-400">
            <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white transition-colors">
              {title}
            </h3>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:bg-transparent hover:text-rose-500"
            onClick={() => onFavoriteToggle?.(id)}
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
            />
          </Button>
        </div>

        <p className="mb-4 line-clamp-3 text-gray-300">
          I'm a college student struggling with my calculus assignment and need help
          understanding derivatives and integrals. The assignment is due in 2 days and I
          really need someone who can explain the concepts clearly and help me solve the
          problems.
        </p>

        <div className="mt-auto grid grid-cols-2 gap-4 border-t border-gray-700/50 pt-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900/30">
              <DollarSign className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Budget</p>
              <p className="font-medium text-white">${price}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/30">
              <Clock className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Delivery</p>
              <p className="font-medium text-white">{deliveryTime}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-blue-500">
              <Image
                src={imageUrl}
                alt={providerName}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{providerName}</p>
              <div className="flex items-center space-x-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs text-gray-400">
                  {rating} ({reviewCount})
                </span>
              </div>
            </div>
          </div>

          {role === 'user' ? (
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
              Place Bid
            </Button>
          ) : (
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-900/20 hover:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const GigsPage = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const toggleFavorite = (id: string) => {
    console.log(`Toggled favorite for gig ${id}`);
  };

  const gigs: GigCardProps[] = [
    {
      id: '1',
      title: 'Need help with calculus homework - derivatives and integrals',
      tier: 1 as const,
      price: 45,
      providerName: 'Alex Johnson',
      providerId: '1',
      rating: 4.5,
      reviewCount: 24,
      imageUrl:
        'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1974&auto=format&fit=crop',
      deliveryTime: '3 Days',
      isFavorite: false,
      onFavoriteToggle: toggleFavorite
    },
    {
      id: '2',
      title: 'Web Development for E-commerce Store',
      tier: 2 as const,
      price: 250,
      providerName: 'Sarah Miller',
      providerId: '2',
      rating: 4.8,
      reviewCount: 156,
      imageUrl:
        'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop',
      deliveryTime: '7 Days',
      isFavorite: true,
      onFavoriteToggle: toggleFavorite
    },
    {
      id: '3',
      title: 'Mobile App UI/UX Design',
      tier: 3 as const,
      price: 500,
      providerName: 'Michael Chen',
      providerId: '3',
      rating: 4.9,
      reviewCount: 89,
      imageUrl:
        'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop',
      deliveryTime: '14 Days',
      isFavorite: false,
      onFavoriteToggle: toggleFavorite
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
      onFavoriteToggle: () => {}
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
      onFavoriteToggle: () => {}
    }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Find Your Next Gig
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              Discover and bid on exciting projects from clients worldwide. Grow your
              portfolio and earn money doing what you love.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 rounded-xl bg-gray-800/50 p-6 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search gigs by keyword, skill, or category..."
                  className="w-full rounded-lg border-gray-700 bg-gray-700/50 py-6 pr-4 pl-12 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div className="flex w-full items-center gap-2 md:w-auto">
                <Select>
                  <SelectTrigger className="min-w-[180px] border-gray-700 bg-gray-700/50 py-6 text-white">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="mobile">Mobile Development</SelectItem>
                    <SelectItem value="design">Design & Creative</SelectItem>
                    <SelectItem value="writing">Writing & Translation</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6 text-base font-medium hover:from-blue-500 hover:to-purple-500"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Create New Gig Button - Only show for providers */}
          {user?.role === 'provider' && (
            <div className="mb-6 flex justify-end">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                onClick={() => router.push('/gigs/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Gig
              </Button>
            </div>
          )}

          {/* Gig Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gigs.map((gig, index) => (
              <GigCard
                key={`${gig.id}-${index}`}
                role={user?.role}
                {...gig}
                onFavoriteToggle={toggleFavorite}
              />
            ))}
          </div>

          {/* Empty State */}
          {gigs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-gray-800 p-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">No gigs found</h3>
              <p className="max-w-md text-gray-400">
                We couldn't find any gigs matching your search. Try adjusting your filters
                or check back later.
              </p>
              {user?.role === 'provider' && (
                <Button
                  className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => router.push('/gigs/new')}
                >
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
