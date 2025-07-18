'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Images } from '@/lib/images';

import { RootState, useDispatch, useSelector } from '@/store/store';
import { gigService } from '@/services/gig.services';
import { formatDate, getDaysBetweenDates } from '@/lib/date-format';
import { Star } from 'lucide-react';
import Loader from '@/components/Loader';

function WorkOpportunities() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  const { gigs, loading } = useSelector((state: RootState) => state.gigs);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollStep = () => {
      if (!el) return;
      el.scrollBy({ left: 1, behavior: 'smooth' });
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
        el.scrollTo({ left: 0, behavior: 'auto' });
      }
    };

    const interval = setInterval(scrollStep, 20);
    return () => clearInterval(interval);
  }, [gigs]);

  useEffect(() => {
    const fetchGigs = async () => {
      dispatch(gigService.clearGigs() as any).then(() => {
        dispatch(gigService.getGigs({ page: 1, search: '', limit: 20 }) as any);
      });
    };

    fetchGigs();
  }, [dispatch]);

  return (
    <>
      <Loader isLoading={loading} />
      {gigs.length > 0 && (
        <section className="mx-auto w-full max-w-[1920px] px-4 py-16 sm:px-6 md:px-10">
          <h2 className="mb-6 text-3xl font-[700] text-[#FFF2E3]">Work Opportunities</h2>
          <p className="mb-4 text-right text-xs text-[#FFF2E3] underline">View more</p>
          <div className="relative">
            <div ref={scrollRef} className="no-scrollbar flex gap-6 overflow-x-auto pb-4">
              {gigs.map((gig: any, i: number) => {
                return (
                  <div key={i} className="min-w-[300px] rounded-xl border border-[#3E3E3E] bg-transparent p-5 sm:min-w-[320px]">
                    <h3 className="mb-1 text-lg font-[600] text-[#FFF2E3]">{gig.title}</h3>
                    <p className="mt-2 text-sm text-gray-400">
                      <span className="mr-2 rounded-3xl bg-[#1D1D1D] px-2 py-1 text-[#1CBAE0]">
                        ${gig.price_range.min} - ${gig.price_range.max}
                      </span>
                      <span className="rounded-3xl bg-[#1D1D1D] px-2 py-1 text-[#FFB9C7]">
                        {getDaysBetweenDates(gig.start_date, gig.end_date)} days
                      </span>
                    </p>
                    <p className="mt-4 mb-2 text-xs text-[#FFF2E3]">{gig.description}</p>
                    <div className="mt-2 flex items-center justify-between border-t border-[#3E3E3E] pt-3 text-sm text-gray-300">
                      <div className="flex w-1/2">
                        <Image src={Images.avatar} alt="vein_diagram" height={44} width={44} className="mr-2" />
                        <div>
                          <div className="text-sm text-[#FFF2E3]">
                            {gig.user.first_name} {gig.user.last_name}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="size-2 fill-amber-400 text-amber-400" />
                            <span className="text-xs text-gray-400">1 (5)</span>
                          </div>
                        </div>
                      </div>
                      <p className="w-1/2 text-right text-xs text-[#66625C]">{formatDate(gig.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default WorkOpportunities;
