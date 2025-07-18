'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const tabs = [
  { key: 'profile', label: 'Profile' },
  { key: 'open-gigs', label: 'Open Gigs' },
  { key: 'portfolio', label: 'Gig Portfolio' }
];

export default function TabSidebar({ role }: { role?: 'user' | 'provider' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const activeTab = searchParams.get('tab');
    !activeTab && handleTabClick('profile');
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="mt-6 space-y-2 px-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          hidden={role === 'user' && tab.key === 'portfolio'}
          onClick={() => handleTabClick(tab.key)}
          className={clsx(
            'flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm font-medium transition',
            activeTab === tab.key
              ? 'bg-gray-700 text-white'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
