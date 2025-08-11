'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const GoBackButton = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex w-full">
      <button className="cursor-pointer rounded-full p-1.5 transition hover:bg-[rgba(0,0,0,0.4)]" onClick={handleGoBack}>
        <ArrowLeft size={22} className="text-sm text-gray-400" />
      </button>
    </div>
  );
};

export default GoBackButton;
