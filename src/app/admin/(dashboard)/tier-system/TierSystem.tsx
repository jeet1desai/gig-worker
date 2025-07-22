'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Edit3, Search, Filter, TrendingUp, Users, DollarSign, Star, Eye, Ellipsis } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { GIGS_LIST, TIER_DATA_LIST } from '@/constants';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const TierSystem = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedGig, setSelectedGig] = useState<any | null>(null);
  const [selectedTierKey, setSelectedTierKey] = useState<string | null>(null);
  const [editedData, setEditedData] = useState({
    title: '',
    description: '',
    examples: ''
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="border-emerald-700 bg-emerald-900/50 text-emerald-300">Active</Badge>;
      case 'paused':
        return <Badge className="border-amber-700 bg-amber-900/50 text-amber-300">Paused</Badge>;
      case 'inactive':
        return <Badge className="border-red-700 bg-red-900/50 text-red-300">Inactive</Badge>;
      default:
        return (
          <Badge variant="outline" className="border-gray-600 text-gray-300">
            {status}
          </Badge>
        );
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-300">{rating}</span>
      </div>
    );
  };

  const handleEditClick = (tierKey: any) => {
    setSelectedTierKey(tierKey);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">Super Admin Dashboard</h1>
          <p className="text-lg text-gray-400">Manage your three-tier freelance gig system</p>
        </div>

        {/* Overall Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="border-indigo-800 bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200">Total Gigs</p>
                  <p className="text-3xl font-bold">590</p>
                </div>
                <TrendingUp className="h-8 w-8 text-indigo-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-800 bg-gradient-to-r from-emerald-900 to-green-900 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-200">Active Providers</p>
                  <p className="text-3xl font-bold">168</p>
                </div>
                <Users className="h-8 w-8 text-emerald-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-800 bg-gradient-to-r from-orange-900 to-red-900 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200">Total Earnings</p>
                  <p className="text-3xl font-bold">$89,090</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-800 bg-gradient-to-r from-blue-900 to-cyan-900 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200">Avg Rating</p>
                  <p className="text-3xl font-bold">4.8</p>
                </div>
                <Star className="h-8 w-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tier Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex space-y-6">
          <TabsList className="gap-4 rounded-full bg-gray-800 p-4">
            <TabsTrigger
              value="basic"
              className="text-sx rounded-full px-6 py-3 font-semibold text-gray-300 transition-all duration-300 hover:bg-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Basic Tier
            </TabsTrigger>

            <TabsTrigger
              value="advanced"
              className="text-sx rounded-full px-6 py-3 font-semibold text-gray-300 transition-all duration-300 hover:bg-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Advanced Tier
            </TabsTrigger>

            <TabsTrigger
              value="expert"
              className="text-sx rounded-full px-6 py-3 font-semibold text-gray-300 transition-all duration-300 hover:bg-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Expert Tier
            </TabsTrigger>
          </TabsList>

          {Object.entries(TIER_DATA_LIST).map(([tier, data]) => (
            <TabsContent key={tier} value={tier} className="space-y-6">
              {/* Tier Info Section */}
              <Card className={`bg-gradient-to-r ${data.bgGradient} border-l-4 border-gray-800`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <CardTitle className="text-2xl text-white">{data.title}</CardTitle>
                        <Badge className={data.color}>{tier.toUpperCase()}</Badge>
                      </div>
                      <CardDescription className="mb-2 text-base text-gray-300">{data.description}</CardDescription>
                      <p className="text-sm text-gray-400">
                        <strong>Examples:</strong> {data.examples}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(tier)}
                      className="ml-4 border-gray-600 bg-gray-800 text-gray-300"
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Tier Stats */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-gray-800 bg-gray-900 transition-colors hover:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Total Gigs</p>
                        <p className="text-2xl font-bold text-white">{data.stats.totalGigs}</p>
                        <p className="mt-1 text-xs text-emerald-400">+12% from last month</p>
                      </div>
                      <div className="rounded-full bg-blue-900/50 p-3">
                        <TrendingUp className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900 transition-colors hover:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Active Providers</p>
                        <p className="text-2xl font-bold text-white">{data.stats.activeProviders}</p>
                        <p className="mt-1 text-xs text-emerald-400">+8% from last month</p>
                      </div>
                      <div className="rounded-full bg-emerald-900/50 p-3">
                        <Users className="h-6 w-6 text-emerald-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900 transition-colors hover:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Total Earnings</p>
                        <p className="text-2xl font-bold text-white">${data.stats.totalEarnings.toLocaleString()}</p>
                        <p className="mt-1 text-xs text-emerald-400">+15% from last month</p>
                      </div>
                      <div className="rounded-full bg-orange-900/50 p-3">
                        <DollarSign className="h-6 w-6 text-orange-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900 transition-colors hover:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Average Rating</p>
                        <p className="text-2xl font-bold text-white">{data.stats.avgRating}</p>
                        <p className="mt-1 text-xs text-emerald-400">+0.2 from last month</p>
                      </div>
                      <div className="rounded-full bg-amber-900/50 p-3">
                        <Star className="h-6 w-6 text-amber-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Filter className="h-5 w-5" />
                    Gig Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                      <Input
                        placeholder="Search gigs or providers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-gray-700 bg-gray-800 pl-10 text-white placeholder:text-gray-500"
                      />
                    </div>

                    <Select value={filterRating} onValueChange={setFilterRating}>
                      <SelectTrigger className="w-[180px] border-gray-700 bg-gray-800 text-white">
                        <SelectValue placeholder="Filter by rating" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-700 bg-gray-800">
                        <SelectItem value="all" className="text-white">
                          All Ratings
                        </SelectItem>
                        <SelectItem value="5" className="text-white">
                          5 Stars
                        </SelectItem>
                        <SelectItem value="4" className="text-white">
                          4+ Stars
                        </SelectItem>
                        <SelectItem value="3" className="text-white">
                          3+ Stars
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Gig Table */}
                  <div className="overflow-hidden rounded-lg border border-gray-700">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700 bg-gray-800">
                          <TableHead className="font-semibold text-gray-300">Gig Title</TableHead>
                          <TableHead className="font-semibold text-gray-300">Provider</TableHead>
                          <TableHead className="font-semibold text-gray-300">Rating</TableHead>
                          <TableHead className="font-semibold text-gray-300">Price</TableHead>
                          <TableHead className="font-semibold text-gray-300">Status</TableHead>
                          <TableHead className="font-semibold text-gray-300">Completions</TableHead>
                          <TableHead className="font-semibold text-gray-300">Earnings</TableHead>
                          <TableHead className="font-semibold text-gray-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {GIGS_LIST.map((gig) => (
                          <TableRow key={gig.id} className="border-gray-700 hover:bg-gray-800">
                            <TableCell className="font-medium text-white">{gig.title}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-sm font-medium text-white">
                                  {gig.provider.charAt(0)}
                                </div>
                                <span className="text-gray-300">{gig.provider}</span>
                              </div>
                            </TableCell>
                            <TableCell>{renderStars(gig.rating)}</TableCell>
                            <TableCell className="font-medium text-emerald-400">${gig.price}</TableCell>
                            <TableCell>{getStatusBadge(gig.status)}</TableCell>
                            <TableCell>
                              <span className="rounded border border-blue-700 bg-blue-900/50 px-2 py-1 text-sm font-medium text-blue-300">
                                {gig.completions}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium text-white">${gig.earnings}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-gray-600 bg-gray-800 text-gray-300"
                                      onClick={() => setSelectedGig(gig)}
                                    >
                                      <Ellipsis className="mr-1 h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>

                                  <DialogContent className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 text-white shadow-xl">
                                    {selectedGig && (
                                      <>
                                        <DialogHeader>
                                          <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-lg font-bold text-white shadow-md">
                                              {selectedGig.provider.charAt(0)}
                                            </div>
                                            <div>
                                              <DialogTitle className="text-xl leading-tight font-semibold text-white">
                                                {selectedGig.title}
                                              </DialogTitle>
                                              <DialogDescription className="text-sm text-gray-400">
                                                Provided by <span className="font-medium text-gray-200">{selectedGig.provider}</span>
                                              </DialogDescription>
                                            </div>
                                          </div>
                                        </DialogHeader>

                                        <div className="mt-6 grid grid-cols-1 gap-5 text-sm text-gray-300 sm:grid-cols-2">
                                          <div>
                                            <p className="mb-1 text-sm text-gray-500 uppercase">Rating</p>
                                            <div>{renderStars(selectedGig.rating)}</div>
                                          </div>

                                          <div>
                                            <p className="mb-1 text-sm text-gray-500 uppercase">Price</p>
                                            <p className="font-semibold text-emerald-400">${selectedGig.price}</p>
                                          </div>

                                          <div>
                                            <p className="mb-1 text-sm text-gray-500 uppercase">Status</p>
                                            <div>{getStatusBadge(selectedGig.status)}</div>
                                          </div>

                                          <div>
                                            <p className="mb-1 text-sm text-gray-500 uppercase">Completions</p>
                                            <p className="inline-block rounded border border-blue-700 bg-blue-900/50 px-3 py-1 text-sm font-medium text-blue-300">
                                              {selectedGig.completions}
                                            </p>
                                          </div>

                                          <div className="sm:col-span-2">
                                            <p className="mb-1 text-xs text-gray-500 uppercase">Total Earnings</p>
                                            <p className="text-lg font-semibold text-white">${selectedGig.earnings.toLocaleString()}</p>
                                          </div>
                                        </div>
                                        <div className="mt-6 flex justify-end gap-4">
                                          <Button
                                            variant="outline"
                                            className="bg-gray-800 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                                          >
                                            Edit
                                          </Button>
                                          <Button
                                            variant="outline"
                                            className="bg-red-800 text-gray-300 hover:bg-red-400"
                                            onClick={() => setShowDeleteConfirm(true)}
                                          >
                                            Delete
                                          </Button>
                                        </div>
                                      </>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                                  <DialogContent className="max-w-sm rounded-xl border border-gray-700 bg-gray-900 text-white shadow-lg backdrop-blur-md backdrop-brightness-75">
                                    <DialogHeader>
                                      <DialogTitle className="text-lg text-white">Confirm Deletion</DialogTitle>
                                      <DialogDescription className="text-sm text-gray-400">
                                        Are you sure you want to delete <span className="font-semibold text-white">{selectedGig?.title}</span>?
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4 flex justify-end gap-3">
                                      <Button
                                        variant="outline"
                                        className="bg-gray-800 text-gray-300"
                                        onClick={() => {
                                          setShowDeleteConfirm(false);
                                          setSelectedGig(null);
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        className="bg-red-700 text-white hover:bg-red-600"
                                        onClick={() => {
                                          setShowDeleteConfirm(false);
                                        }}
                                      >
                                        Confirm
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
          <Dialog open={!!selectedTierKey} onOpenChange={(open) => !open && setSelectedTierKey(null)}>
            <DialogContent className="max-w-lg rounded-xl border border-gray-700 bg-gray-900 text-white shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-lg text-white">Edit Tier Details</DialogTitle>
                <DialogDescription className="text-sm text-gray-400">Update the title, description, and examples for this tier.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-300">Title</label>
                  <Input
                    className="bg-gray-800 text-white"
                    value={editedData.title}
                    onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-300">Description</label>
                  <Textarea
                    className="bg-gray-800 text-white"
                    value={editedData.description}
                    onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-300">Examples</label>
                  <Input
                    className="bg-gray-800 text-white"
                    value={editedData.examples}
                    onChange={(e) => setEditedData({ ...editedData, examples: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" className="bg-gray-700 text-gray-200" onClick={() => setSelectedTierKey(null)}>
                  Cancel
                </Button>
                <Button className="bg-gray-800 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md">Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </Tabs>
      </div>
    </div>
  );
};

export default TierSystem;
