'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { gigService } from '@/services/gig.services';
import GigCard from './GigCard';

interface UserGigsProps {
  userId: string;
}

const SCROLL_THRESHOLD = 200;

const UserGigs = ({ userId }: UserGigsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fetchedPages = useRef(new Set<number>());

  const [gigs, setGigs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchGigs = async (pageToFetch: number) => {
    if (loading || fetchedPages.current.has(pageToFetch)) return;

    setLoading(true);
    fetchedPages.current.add(pageToFetch);

    try {
      const res = await gigService.getUserGigsByiId(userId, pageToFetch);
      const newGigs = res.data.gigs ?? [];

      setGigs((prev) => {
        const existingIds = new Set(prev.map((g) => g.id));
        const uniqueGigs = newGigs.filter((g: any) => !existingIds.has(g.id));
        return [...prev, ...uniqueGigs];
      });

      setHasMore(res.data.totalPages > page);
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs(1);
  }, [userId]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || loading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD) {
        setPage((prev) => prev + 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading, hasMore]);

  useEffect(() => {
    if (page === 1) return;
    fetchGigs(page);
  }, [page]);

  return (
    <div className="rounded-x flex h-full flex-col space-y-4">
      <h3 className="mb-5 px-2 text-2xl font-semibold text-gray-300">Posted Gigs</h3>

      {gigs.length === 0 && !loading ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-md text-center text-gray-400">No gigs found</p>
        </div>
      ) : (
        <div ref={containerRef} className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-2">
          {gigs.map((gig) => (
            <div key={gig.id}>
              <GigCard {...gig} isActive={true} activeStatus={gig.pipeline.status} />
            </div>
          ))}
          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserGigs;
