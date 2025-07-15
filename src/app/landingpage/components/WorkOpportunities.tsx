'use client';
import { useEffect, useRef } from 'react';
import { workOpportunities } from '@/constants/LandingPage';
import { Images } from '@/lib/images';
import Image from 'next/image';

function WorkOpportunities() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
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
  }, []);

  return (
    <section className="mx-auto w-full max-w-[1920px] px-4 py-16 sm:px-6 md:px-10">
      <h2 className="mb-6 text-3xl font-[700] text-[#FFF2E3]">Work Opportunities</h2>
      <p className="mb-4 text-right text-xs text-[#FFF2E3] underline">View more</p>
      <div className="relative">
        <div ref={scrollRef} className="no-scrollbar flex gap-6 overflow-x-auto pb-4">
          {workOpportunities.map((item, i) => (
            <div key={i} className="min-w-[300px] rounded-xl border border-[#3E3E3E] bg-transparent p-5 sm:min-w-[320px]">
              <h3 className="mb-1 text-lg font-[600] text-[#FFF2E3]">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-400">
                <span className="mr-2 rounded-3xl bg-[#1D1D1D] px-2 py-1 text-[#1CBAE0]">{item.price}</span>
                <span className="rounded-3xl bg-[#1D1D1D] px-2 py-1 text-[#FFB9C7]">{item.duration}</span>
              </p>
              <p className="mt-2 text-xs text-[#FFF2E3]">{item.description}</p>
              <div className="mt-2 flex items-center justify-between border-t border-[#3E3E3E] py-3 text-sm text-gray-300">
                <div className="flex w-1/2">
                  <Image src={Images.avatar} alt="vein_diagram" height={44} width={44} className="mr-2" />
                  <div>
                    <div className="text-sm text-[#FFF2E3]">{item.provider}</div>
                    <div className="mt-2 text-xs text-[#FFF2E3]">{item.place}</div>
                  </div>
                </div>
                <p className="w-1/2 text-right text-xs text-[#66625C]">{item.postTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WorkOpportunities;
