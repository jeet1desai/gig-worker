'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell, TableCaption } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Pencil, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/layouts/layout';
import { USER_GIGS } from '@/constants';

export function UserGigsList() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-2 sm:p-6">
        <div>
          <h3 className="mb-6 text-2xl font-semibold text-[#FFF2E3]">Manage and track your gigs.</h3>
        </div>

        <div className="mb-8 rounded-xl bg-gray-800/50 p-4 backdrop-blur-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 sm:left-4 sm:h-5 sm:w-5" />
              <Input
                placeholder="Search gigs by keyword, status, or category..."
                className="w-full rounded-lg border-gray-700 bg-gray-700/50 py-4 pr-3 pl-10 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 sm:py-6 sm:pr-4 sm:pl-12 sm:text-base"
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4 text-sm font-medium text-white hover:from-blue-500 hover:to-purple-500 sm:w-auto sm:px-6 sm:py-6 sm:text-base"
              >
                <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Search
              </Button>
            </div>
          </div>
        </div>

        <Card className="bg-card border-border mt-8 border shadow dark:bg-[#1f2937]">
          <CardHeader>
            <CardTitle className="text-base text-xl">Your Gigs ({USER_GIGS.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {USER_GIGS.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-800">
                    <TableHead className="px-4 py-3 text-left">Gig Details</TableHead>
                    <TableHead className="px-4 py-3 text-center">Tier system</TableHead>
                    <TableHead className="px-4 py-3 text-center">Status</TableHead>
                    <TableHead className="px-4 py-3 text-center">Price</TableHead>
                    <TableHead className="px-4 py-3 text-center">Created</TableHead>
                    <TableHead className="px-4 py-3 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {USER_GIGS.map((gig) => (
                    <TableRow key={gig.id}>
                      <TableCell className="px-4 py-3 text-left">
                        <div className="flex items-center gap-3">
                          <img src={gig.image} alt={gig.title} className="h-10 w-10 rounded object-cover" />
                          <span className="text-sm text-white">{gig.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-left">{gig.tier}</TableCell>
                      <TableCell className="px-4 py-3 text-left capitalize">{gig.status}</TableCell>
                      <TableCell className="px-4 py-3 text-left">${gig.price}</TableCell>
                      <TableCell className="px-4 py-3 text-left">{gig.createdAt}</TableCell>
                      <TableCell className="px-4 py-3 text-left">
                        <div className="flex justify-start gap-2">
                          <Button size="icon" variant="ghost" className="hover:text-blue-500">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center">
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="text-foreground mb-2 text-xl font-semibold">No gigs found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
