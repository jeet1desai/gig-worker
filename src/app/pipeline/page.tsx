'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, DollarSign, MapPin, MessageSquare, Star, View } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layouts/layout';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

import { RootState, useSelector } from '@/store/store';

const userGigs = {
  open: [
    { id: 1, title: 'Website Development', budget: '$500 - $1000', location: 'Remote', posted: '2 days ago' },
    { id: 2, title: 'Mobile App Design', budget: '$1000 - $2000', location: 'New York', posted: '1 week ago' }
  ],
  inProgress: [
    {
      id: 3,
      title: 'Logo Design',
      status: 'In Progress',
      deadline: '2023-12-15',
      provider: { id: 1, name: 'John Doe', rating: 4.8, completedGigs: 24, avatar: '/placeholder-avatar.jpg' },
      startedOn: '2023-11-01',
      progress: 65
    },
    {
      id: 3,
      title: 'Logo Design',
      status: 'In Progress',
      deadline: '2023-12-15',
      provider: { id: 1, name: 'John Doe', rating: 4.8, completedGigs: 24, avatar: '/placeholder-avatar.jpg' },
      startedOn: '2023-11-01',
      progress: 65
    }
  ],
  completed: [
    {
      id: 4,
      title: 'Content Writing',
      completedOn: '2023-11-20',
      rating: 4.5,
      provider: { id: 2, name: 'Jane Smith', rating: 4.9, completedGigs: 42, avatar: '/placeholder-avatar2.jpg' },
      workedOn: '2023-11-15 to 2023-11-20',
      totalEarned: '$450'
    }
  ]
};

const providerBids = {
  pending: [{ id: 1, title: 'E-commerce Website', budget: '$1200', client: 'Jane Smith', daysLeft: 3 }],
  accepted: [{ id: 2, title: 'Mobile App Development', budget: '$2500', client: 'Acme Inc', status: 'In Progress' }],
  rejected: [{ id: 3, title: 'SEO Services', budget: '$800', client: 'Local Business', reason: 'Budget too low' }]
};

const UserPipelinePage = ({
  activeUserTab,
  setActiveUserTab,
  setIsReviewDialogOpen
}: {
  activeUserTab: string;
  setActiveUserTab: (tab: string) => void;
  setIsReviewDialogOpen: (open: boolean) => void;
}) => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Gigs</h2>
        <Button className="border-blue-500 bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => router.push('/gigs/new')}>
          + Create New Gig
        </Button>
      </div>

      <Tabs value={activeUserTab} onValueChange={setActiveUserTab}>
        <TabsList className="mb-4 grid w-full grid-cols-3 bg-gray-800 p-1">
          <TabsTrigger value="open" className="text-gray-100 data-[state=active]:text-black">
            Open ({userGigs.open.length})
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="text-gray-100 data-[state=active]:text-black">
            In Progress ({userGigs.inProgress.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-gray-100 data-[state=active]:text-black">
            Completed ({userGigs.completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4">
          {userGigs.open.map((gig) => (
            <Card key={gig.id} className="gap-2 bg-inherit">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle onClick={() => router.push(`/gigs/${gig.id}`)} className="text-xl font-medium">
                  {gig.title}
                </CardTitle>
                <Badge variant="outline" className="bg-green-600 text-white">
                  Open
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <DollarSign className="mr-1 h-4 w-4" /> {gig.budget}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" /> {gig.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" /> {gig.posted}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          {userGigs.inProgress.map((gig) => (
            <Card key={gig.id} className="gap-2 overflow-hidden bg-inherit">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <CardTitle onClick={() => router.push(`/gigs/${gig.id}`)} className="text-xl font-medium">
                  {gig.title}
                </CardTitle>
                <div className="text-right">
                  <Badge variant="secondary" className="mt-2">
                    {gig.status}
                  </Badge>
                </div>
              </CardHeader>
              <Separator className="my-4" />

              <CardContent>
                <div>
                  <h4 className="mb-2 text-sm font-medium">Provider Working On This</h4>
                  <div className="bg-muted/30 flex items-center justify-between rounded-lg p-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
                        {/* <img src={gig.provider.avatar} alt={gig.provider.name} className="h-full w-full object-cover" /> */}
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={gig.provider.avatar || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">{`${gig.provider.name[0]}`}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="font-medium">{gig.provider.name}</p>
                        <div className="text-muted-foreground flex items-center space-x-1 text-sm">
                          <span>⭐ {gig.provider.rating}</span>
                          <span>•</span>
                          <span>{gig.provider.completedGigs} gigs</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button className="bg-inherit" variant="outline" size="sm" onClick={() => router.push(`/messages/${gig.provider.id}`)}>
                        <View className="h-4 w-4" />
                      </Button>
                      <Button className="bg-inherit" variant="outline" size="sm" onClick={() => router.push(`/messages/${gig.provider.id}`)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="text-muted-foreground text-sm">Started on {gig.startedOn}</p>
                    <p className="text-muted-foreground text-sm">Deadline: {gig.deadline}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button className="bg-inherit" variant="outline" size="sm" onClick={() => router.push(`/gigs/${gig.id}`)}>
                      View Details
                    </Button>
                    <Button onClick={() => setIsReviewDialogOpen(true)} className="bg-inherit" variant="outline" size="sm">
                      Mark As Completed
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {userGigs.completed.map((gig) => (
            <Card key={gig.id} className="gap-2 overflow-hidden bg-inherit">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <h3 className="text-lg font-semibold">{gig.title}</h3>
                  <div className="mt-2 flex items-center">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Completed
                    </Badge>
                    <div className="ml-2 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(gig.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-muted-foreground ml-1 text-sm">{gig.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-sm">Completed on {gig.completedOn}</p>
                  <p className="text-sm font-medium">Total: {gig.totalEarned}</p>
                </div>
              </CardHeader>

              <Separator className="my-4" />

              <CardContent>
                <div>
                  <h4 className="mb-2 text-sm font-medium">Provider</h4>
                  <div className="bg-muted/30 flex items-center justify-between rounded-lg p-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
                        {/* <img src={gig.provider.avatar} alt={gig.provider.name} className="h-full w-full object-cover" /> */}
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={gig.provider.avatar || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">{`${gig.provider.name[0]}`}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="font-medium">{gig.provider.name}</p>
                        <div className="text-muted-foreground flex items-center space-x-1 text-sm">
                          <span>⭐ {gig.provider.rating}</span>
                          <span>•</span>
                          <span>{gig.provider.completedGigs} gigs</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button className="bg-inherit" variant="outline" size="sm" onClick={() => router.push(`/messages/${gig.provider.id}`)}>
                        <View className="h-4 w-4" />
                      </Button>
                      <Button className="bg-inherit" variant="outline" size="sm" onClick={() => router.push(`/messages/${gig.provider.id}`)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ProviderPipelinePage = ({
  activeProviderTab,
  setActiveProviderTab
}: {
  activeProviderTab: string;
  setActiveProviderTab: (tab: string) => void;
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">My Bids</h2>

      <Tabs value={activeProviderTab} onValueChange={setActiveProviderTab}>
        <TabsList className="mb-4 grid w-full grid-cols-3 bg-gray-800 p-1">
          <TabsTrigger value="pending" className="text-gray-100 data-[state=active]:text-black">
            Pending ({providerBids.pending.length})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="text-gray-100 data-[state=active]:text-black">
            Accepted ({providerBids.accepted.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-gray-100 data-[state=active]:text-black">
            Rejected ({providerBids.rejected.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {providerBids.pending.map((bid) => (
            <Card key={bid.id} className="gap-2 overflow-hidden bg-inherit">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">{bid.title}</CardTitle>
                <Badge variant="outline" className="bg-amber-50 text-amber-600">
                  Pending
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground text-sm">
                  <p>Client: {bid.client}</p>
                  <p>Budget: {bid.budget}</p>
                  <p>Days left to respond: {bid.daysLeft}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {providerBids.accepted.map((bid) => (
            <Card key={bid.id} className="gap-2 overflow-hidden bg-inherit">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">{bid.title}</CardTitle>
                <Badge variant="secondary">{bid.status}</Badge>
              </CardHeader>
              <CardContent className="flex flex-row items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  <p>Client: {bid.client}</p>
                  <p>Budget: {bid.budget}</p>
                </div>
                <div className="flex space-x-2">
                  <Button className="bg-inherit" variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button className="bg-inherit" variant="outline" size="sm">
                    Message Client
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {providerBids.rejected.map((bid) => (
            <Card key={bid.id} className="gap-2 overflow-hidden bg-inherit">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">{bid.title}</CardTitle>
                <Badge variant="destructive">Rejected</Badge>
              </CardHeader>
              <CardContent className="flex flex-row items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  <p>Client: {bid.client}</p>
                  <p>Budget: {bid.budget}</p>
                </div>
                <div className="flex space-x-2">
                  <Button className="bg-inherit" variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PipelinePage = () => {
  const { role } = useSelector((state: RootState) => state.user);

  const [activeUserTab, setActiveUserTab] = useState('open');
  const [activeProviderTab, setActiveProviderTab] = useState('pending');

  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {};

  return (
    <DashboardLayout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-6">
          {role === 'user' ? (
            <UserPipelinePage activeUserTab={activeUserTab} setActiveUserTab={setActiveUserTab} setIsReviewDialogOpen={setIsReviewDialogOpen} />
          ) : (
            <ProviderPipelinePage activeProviderTab={activeProviderTab} setActiveProviderTab={setActiveProviderTab} />
          )}
        </div>
      </div>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="border-slate-700 bg-slate-800 text-white sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Rate John Doe</DialogTitle>
            <DialogDescription>Share your experience working with John Doe. Your feedback helps us improve our platform.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-start space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                  <Star className={`h-8 w-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Your Review (optional)
              </label>
              <Textarea
                id="comment"
                placeholder="Share details about your experience..."
                className="min-h-[100px] bg-inherit"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button className="bg-inherit" variant="outline" onClick={() => setIsReviewDialogOpen(false)} disabled={false}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={rating === 0 || false} className="bg-blue-600 text-white shadow-none hover:bg-blue-700">
              Submit Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PipelinePage;
