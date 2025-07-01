import { stats } from '@/constants/LandingPage';
import React from 'react';

function Statics() {
  return (
    <section className="mx-auto w-full max-w-[1920px] rounded-lg border border-[#FFFFFF] bg-[#111111]">
      <div className="grid grid-cols-2 px-10 py-10 text-center md:grid-cols-4">
        {stats.map(([value, label], i) => (
          <div key={i} className="text-xl">
            <div className="text-3xl font-bold text-[#FFFFFF]">{value}</div>
            <div className="text-sm text-[#FFFFFF]">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Statics;
