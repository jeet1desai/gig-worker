'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboardService } from '@/services/dashboard.services';
import { RootState, useDispatch, useSelector } from '@/store/store';
import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { PRIVATE_ROUTE } from '@/constants/app-routes';
import Loader from '@/components/Loader';

export function WeeklySummary() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, recentGigs } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(dashboardService.getRecentGigs() as any);
  }, [dispatch]);

  const [sortKey, setSortKey] = useState<'title' | 'days' | 'total_earnings' | 'status' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: 'title' | 'days' | 'total_earnings' | 'status') => {
    if (key === sortKey) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = [...recentGigs].sort((a, b) => {
    if (!sortKey) return 0;
    let valA: string | number = '';
    let valB: string | number = '';

    if (sortKey === 'status') {
      valA = a.pipeline.status;
      valB = b.pipeline.status;
    } else {
      valA = a[sortKey];
      valB = b[sortKey];
    }

    if (typeof valA === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
    }

    if (typeof valA === 'number') {
      return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    }

    return 0;
  });

  const getTierLabel = (tier: string) => {
    if (tier.includes('basic')) return 'Tier 1: Basic';
    if (tier.includes('advanced')) return 'Tier 2: Advanced';
    if (tier.includes('expert')) return 'Tier 3: Expert';
    return tier;
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'open':
        return 'border border-blue-700/50 bg-blue-900/50 text-blue-400';
      case 'requested':
        return 'border border-indigo-700/50 bg-indigo-900/50 text-indigo-400';
      case 'in_progress':
        return 'border border-yellow-700/50 bg-yellow-900/50 text-yellow-400';
      case 'completed':
        return 'border border-green-700/50 bg-green-900/50 text-green-400';
      case 'rejected':
        return 'border border-red-700/50 bg-red-900/50 text-red-400';
      default:
        return '';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700/50 p-6 shadow-none backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recent Gigs</h3>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <Loader isLoading={loading} />
        ) : (
          <Table className="min-w-full border-spacing-2 !border-slate-700/50">
            <TableHeader>
              <TableRow className="border-b !border-slate-700/50">
                <TableHead onClick={() => handleSort('title')} className="text-md cursor-pointer font-semibold text-white">
                  Gig Details
                  <div className="ml-1">
                    {sortKey === 'title' && (sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('days')} className="text-md cursor-pointer font-semibold text-white">
                  Days
                  <div className="ml-1">
                    {sortKey === 'days' && (sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('total_earnings')} className="text-md cursor-pointer font-semibold text-white">
                  Earnings
                  <div className="ml-1">
                    {sortKey === 'total_earnings' && (sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('status')} className="text-md cursor-pointer font-semibold text-white">
                  Status
                  <div className="ml-1">
                    {sortKey === 'status' && (sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item, index) => (
                <TableRow key={index} className="border-b border-slate-700/50 hover:bg-slate-700/10">
                  <TableCell className="py-3">
                    <div className="mb-1 text-sm text-slate-400">{moment(item.start_date).format('ddd, MMM DD YYYY')}</div>
                    <div className="cursor-pointer text-sm font-medium text-white" onClick={() => router.push(`${PRIVATE_ROUTE.GIGS}/${item.id}`)}>
                      {item.title}
                    </div>
                    <div className="text-xs text-blue-400">{getTierLabel(item.tier)}</div>
                  </TableCell>
                  <TableCell className="py-3 text-sm text-slate-400">{item.days}</TableCell>
                  <TableCell className="py-3 text-sm font-semibold text-white">{item.total_earnings}</TableCell>
                  <TableCell className="py-3">
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusClasses(item.pipeline.status)}`}>
                      {item.pipeline.status.replace('_', ' ')}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
