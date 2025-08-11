'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';

interface SortIndicatorProps {
  currentKey: string;
  sortKey: string | null;
  sortOrder: 'asc' | 'desc';
  className?: string;
}

const SortIndicator: React.FC<SortIndicatorProps> = ({ currentKey, sortKey, sortOrder, className = 'ml-1' }) => {
  if (sortKey !== currentKey) return null;

  return <div className={className}>{sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}</div>;
};

export default SortIndicator;
