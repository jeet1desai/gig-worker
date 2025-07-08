'use client';

import React, { useEffect } from 'react';

interface Props {
  isLoading: boolean;
}

const Loader: React.FC<Props> = ({ isLoading }) => {
  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[1600] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="relative h-20 w-20">
        <div className="animate-spin-slow absolute inset-0 rounded-full border-4 border-t-transparent border-r-white/40 border-b-transparent border-l-white/40"></div>
        <div className="animate-spin-fast absolute inset-2 rounded-full border-4 border-t-white border-r-transparent border-b-white/20 border-l-transparent"></div>
        <div className="absolute inset-[35%] h-4 w-4 rounded-full bg-white/80 shadow-md" />
      </div>
    </div>
  );
};

export default Loader;
