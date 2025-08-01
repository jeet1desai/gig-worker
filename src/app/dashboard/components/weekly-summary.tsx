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
import { cn } from '@/lib/utils';

export function WeeklySummary() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, recentGigs } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(dashboardService.getRecentGigs() as any);
  }, [dispatch]);

  const [sortKey, setSortKey] = useState<'title' | 'duration_in_days' | 'total_earnings' | 'status' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: 'title' | 'duration_in_days' | 'total_earnings' | 'status') => {
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
      valA = a.pipeline_status;
      valB = b.pipeline_status;
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

  const tierColors: Record<string, string> = {
    basic: 'text-blue-400',
    advanced: 'text-purple-400',
    expert: 'text-amber-400'
  };

  const statusColors: Record<string, string> = {
    open: 'border border-blue-700/50 bg-blue-900/50 text-blue-400',
    requested: 'border border-indigo-700/50 bg-indigo-900/50 text-indigo-400',
    in_progress: 'border border-yellow-700/50 bg-yellow-900/50 text-yellow-400',
    completed: 'border border-green-700/50 bg-green-900/50 text-green-400',
    rejected: 'border border-red-700/50 bg-red-900/50 text-red-400'
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
                <TableHead onClick={() => handleSort('duration_in_days')} className="text-md cursor-pointer font-semibold text-white">
                  Days
                  <div className="ml-1">
                    {sortKey === 'duration_in_days' && (sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
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
                    <div className={cn('text-xs text-blue-400 capitalize', tierColors[item.tier])}>{item.tier} Tier</div>
                  </TableCell>
                  <TableCell className="py-3 text-sm text-slate-400">{item.duration_in_days}</TableCell>
                  <TableCell className="py-3 text-sm font-semibold text-white">{item.total_earnings}</TableCell>
                  <TableCell className="py-3">
                    <span className={cn('inline-block rounded-full px-2 py-1 text-xs font-medium capitalize', statusColors[item.pipeline_status])}>
                      {item.pipeline_status.replace('_', ' ')}
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
