import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

export default function GigsShimmerCards() {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <div
          className={cn(
            'group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/50 transition-all duration-300 hover:border-gray-600 hover:shadow-gray-900/20'
          )}
          key={i}
        >
          <div className="relative h-48 overflow-hidden">
            <Skeleton className="h-full w-full rounded-none" />
            <div className="absolute top-3 right-3">
              <Skeleton className="h-6 w-20" />
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>

            <div className="mb-4 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-2/3" />
            </div>

            <div className="mt-auto grid grid-cols-3 gap-2 border-t border-gray-700/50 pt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-2 w-14" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
