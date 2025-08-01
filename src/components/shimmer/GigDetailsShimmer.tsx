import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function GigDetailsShimmer() {
  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-32 rounded-md" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-[270px] w-full rounded-lg" />

          <Card className="rounded-lg border-gray-700/50 bg-inherit">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>

              <Skeleton className="h-8 w-3/4 rounded-md" />

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>

              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-20 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-gray-700/50 bg-inherit">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              <div className="bg-muted/30 grid grid-cols-1 gap-4 rounded-lg p-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>

            <CardContent className="space-y-4 pt-0">
              <Skeleton className="h-6 w-40" />
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="ml-auto h-4 w-20" />
                  </div>
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
              <Skeleton className="h-10 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-1">
          <Card className="rounded-lg border-gray-700/50 bg-inherit">
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-6 w-32" />
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-md" />
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg border-gray-700/50 bg-inherit">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
              <Skeleton className="h-10 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Card className="rounded-lg border-gray-700/50 bg-inherit">
          <CardHeader>
            <CardTitle className="text-white">
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
