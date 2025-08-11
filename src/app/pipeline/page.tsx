'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, DollarSign, MapPin, MessageSquare, Star, View, CheckCircle, AlertCircle } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layouts/layout';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

import { RootState, useDispatch, useSelector } from '@/store/store';
import { pipelineService } from '@/services/pipeline.services';
import { Gig, ProviderBid, Pagination, UserPipelineCounts, ProviderPipelineCounts } from '@/types/pipeline';

import { formatDate } from '@/lib/date-format';
import Loader from '@/components/Loader';
import { BID_STATUS, GIG_STATUS, PAYMENT_STATUS } from '@prisma/client';
import { PRIVATE_ROUTE } from '@/constants/app-routes';
import { formatCurrency } from '@/lib/utils';

export const getPaymentStatusLabel = (gig: Partial<Gig>) => {
  const payment = gig?.payment?.[0];
  if (payment && payment?.status === PAYMENT_STATUS.completed) {
    return (
      <span className="inline-flex items-center gap-2 rounded bg-green-700 px-3 py-1 text-sm text-white">
        <CheckCircle className="h-4 w-4" />
        Payment Completed
      </span>
    );
  }
  if (gig?.review_rating?.rating !== undefined && gig.review_rating.rating > 2 && payment && payment?.status === PAYMENT_STATUS.held) {
    return (
      <span className="inline-flex items-center gap-2 rounded bg-yellow-700 px-3 py-1 text-sm text-white">
        <AlertCircle className="h-4 w-4" />
        Payment Pending
      </span>
    );
  }
  if (gig?.review_rating?.rating !== undefined && gig.review_rating.rating < 3) {
    return (
      <span className="inline-flex items-center gap-2 rounded bg-red-700 px-3 py-1 text-sm text-white">
        <AlertCircle className="h-4 w-4" />
        Complaint: Low rating
      </span>
    );
  }
  if (Object.keys(gig?.review_rating || {}).length === 0 && !payment) {
    return (
      <span className="inline-flex items-center gap-2 rounded bg-yellow-700 px-3 py-1 text-sm text-white">
        <AlertCircle className="h-4 w-4" />
        Rating & Payment Pending
      </span>
    );
  }
  return null;
};

const UserPipelinePage = ({
  activeUserTab,
  setActiveUserTab,
  setIsReviewDialogOpen,
  pipeline,
  pagination,
  counts
}: {
  activeUserTab: string;
  setActiveUserTab: (tab: string) => void;
  setIsReviewDialogOpen: (open: boolean) => void;
  pipeline: {
    open: Gig[];
    inProgress: Gig[];
    completed: Gig[];
  };
  pagination: Pagination;
  counts: UserPipelineCounts;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const loadUserMore = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      dispatch(pipelineService.getUserPipeline({ page: pagination.page + 1, status: activeUserTab, limit: 10 }) as any);
    }
  }, [pagination.page, pagination.totalPages]);

  const handleNagivation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Gigs</h2>
        <Button
          className="border-blue-500 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          onClick={() => handleNagivation(PRIVATE_ROUTE.ADD_GIG)}
        >
          + Create New Gig
        </Button>
      </div>

      <Tabs value={activeUserTab} onValueChange={setActiveUserTab}>
        <TabsList className="mb-4 grid w-full grid-cols-3 bg-gray-800 p-1">
          <TabsTrigger value="open" className="text-gray-100 data-[state=active]:text-black">
            Open ({counts.open})
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="text-gray-100 data-[state=active]:text-black">
            In Progress ({counts.inProgress})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-gray-100 data-[state=active]:text-black">
            Completed ({counts.completed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open">
          <InfiniteScroll
            dataLength={pipeline.open.length}
            next={loadUserMore}
            hasMore={pagination.page < pagination.totalPages}
            loader={<Loader isLoading={true} />}
            scrollThreshold={0.9}
            className="space-y-4"
          >
            {pipeline.open.map((gig: Gig) => {
              return (
                <Card key={gig.id} className="cursor-pointer gap-2 bg-inherit" onClick={() => handleNagivation(`${PRIVATE_ROUTE.GIGS}/${gig.slug}`)}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xl font-medium">{gig.title}</CardTitle>
                    <Badge variant="outline" className="bg-green-600 text-white">
                      Open
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4" /> {gig?.price_range?.min} - {gig?.price_range?.max}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" /> {gig?.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" /> {formatDate(gig?.start_date)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </InfiniteScroll>
        </TabsContent>

        <TabsContent value="in_progress">
          <InfiniteScroll
            dataLength={pipeline.inProgress.length}
            next={loadUserMore}
            hasMore={pagination.page < pagination.totalPages}
            loader={<Loader isLoading={true} />}
            scrollThreshold={0.9}
            className="space-y-4"
          >
            {pipeline.inProgress.map((gig: Gig) => {
              return (
                <Card key={gig.id} className="gap-2 overflow-hidden bg-inherit">
                  <CardHeader className="flex flex-col items-start space-y-0">
                    <div className="flex w-full flex-row items-start justify-between space-y-0">
                      <CardTitle className="text-xl font-medium">{gig.title}</CardTitle>
                      <div className="text-right">
                        <Badge variant="secondary" className="mt-2">
                          In Progress
                        </Badge>
                      </div>
                    </div>

                    <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4" /> {gig?.acceptedBid?.reduce((acc: number, bid: any) => acc + Number(bid.bid_price), 0)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" /> {gig.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" /> {formatDate(gig?.start_date)}
                      </div>
                    </div>
                  </CardHeader>
                  <Separator className="my-4" />
                  <CardContent>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Provider Working On This</h4>
                      <div className="space-y-2">
                        {gig?.acceptedBid?.map((bid) => {
                          return (
                            <div key={bid.id} className="bg-muted/30 flex items-center justify-between rounded-lg p-2">
                              <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage src={bid.provider.profile_url || ''} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">{`${bid.provider.first_name[0]}`}</AvatarFallback>
                                  </Avatar>
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {bid.provider.first_name} {bid.provider.last_name}
                                  </p>
                                  <div className="text-muted-foreground flex items-center space-x-1 text-sm">
                                    <span>⭐ {gig?.providerStats?.avgRating || 0}</span>
                                    <span>•</span>
                                    <span>{gig?.providerStats?.totalCompletedGigs || 0} gigs</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  className="bg-inherit"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleNagivation(`${PRIVATE_ROUTE.USER_PROFILE}/${bid.provider.username}`)}
                                >
                                  <View className="h-4 w-4" />
                                </Button>
                                <Button className="bg-inherit" variant="outline" size="sm">
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-muted-foreground text-sm">Started on: {formatDate(gig.start_date)}</p>
                        <p className="text-muted-foreground text-sm">Deadline: {formatDate(gig.end_date)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          className="bg-inherit"
                          variant="outline"
                          size="sm"
                          onClick={() => handleNagivation(`${PRIVATE_ROUTE.GIGS}/${gig.slug}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </InfiniteScroll>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <InfiniteScroll
            dataLength={pipeline.completed.length}
            next={loadUserMore}
            hasMore={pagination.page < pagination.totalPages}
            loader={<Loader isLoading={true} />}
            scrollThreshold={0.9}
            className="space-y-4"
          >
            {pipeline.completed.map((gig: Gig) => {
              const gig_bid_price = gig?.acceptedBid?.reduce((acc: number, bid) => acc + Number(bid.bid_price), 0);
              return (
                <Card
                  key={gig.id}
                  className="cursor-pointer gap-2 overflow-hidden bg-inherit"
                  onClick={() => handleNagivation(`${PRIVATE_ROUTE.GIGS}/${gig.slug}`)}
                >
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
                              className={`h-4 w-4 ${i < Math.floor(gig?.review_rating?.rating ?? 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-muted-foreground ml-1 text-sm">{gig?.review_rating?.rating || 0}</span>
                        </div>
                        {gig.status === GIG_STATUS.completed && <div className="ml-4">{getPaymentStatusLabel(gig)}</div>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">Completed on {formatDate(gig.completed_at)}</p>
                      <p className="text-sm font-medium">Total: {formatCurrency(gig_bid_price?.toFixed(2) as string, 'USD')}</p>
                    </div>
                  </CardHeader>

                  <Separator className="my-4" />

                  <CardContent>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Provider</h4>
                      <div className="space-y-2">
                        {gig?.acceptedBid?.map((bid) => {
                          return (
                            <div key={bid.id} className="bg-muted/30 flex items-center justify-between rounded-lg p-2">
                              <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage src={bid.provider.profile_url || ''} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">{`${bid.provider.first_name[0]}`}</AvatarFallback>
                                  </Avatar>
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {bid.provider.first_name} {bid.provider.last_name}
                                  </p>
                                  <div className="text-muted-foreground flex items-center space-x-1 text-sm">
                                    <span>⭐ {gig?.providerStats?.avgRating || 0}</span>
                                    <span>•</span>
                                    <span>{gig?.providerStats?.totalCompletedGigs || 0} gigs</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  className="bg-inherit"
                                  variant="outline"
                                  size="sm"
                                  onClick={(event) => {
                                    handleNagivation(`${PRIVATE_ROUTE.USER_PROFILE}/${bid.provider.username}`);
                                    event.stopPropagation();
                                  }}
                                >
                                  <View className="h-4 w-4" />
                                </Button>
                                <Button className="bg-inherit" variant="outline" size="sm">
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </InfiniteScroll>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ProviderPipelinePage = ({
  activeProviderTab,
  setActiveProviderTab,
  providerPipeline,
  pagination,
  counts
}: {
  activeProviderTab: string;
  setActiveProviderTab: (tab: string) => void;
  providerPipeline: ProviderBid[];
  pagination: Pagination;
  counts: ProviderPipelineCounts | null;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const loadProviderMore = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      dispatch(pipelineService.getProviderPipeline({ page: pagination.page + 1, status: activeProviderTab, limit: 10 }));
    }
  }, [pagination.page, pagination.totalPages, activeProviderTab, dispatch]);

  const handleNagivation = (path: string) => {
    router.push(path);
  };

  const formatLabel = (status: string) => status && status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">My Bids</h2>

      <Tabs value={activeProviderTab} onValueChange={setActiveProviderTab}>
        <TabsList className="mb-4 grid w-full grid-cols-3 bg-gray-800 p-1">
          <TabsTrigger value="pending" className="text-gray-100 data-[state=active]:text-black">
            Pending ({counts?.pending || 0})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="text-gray-100 data-[state=active]:text-black">
            Accepted ({counts?.accepted || 0})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-gray-100 data-[state=active]:text-black">
            Rejected ({counts?.rejected || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <InfiniteScroll
            dataLength={providerPipeline.length}
            next={loadProviderMore}
            hasMore={pagination.page < pagination.totalPages}
            loader={<Loader isLoading={true} />}
            scrollThreshold={0.9}
            className="space-y-4"
          >
            {providerPipeline.map((bid) => (
              <Card key={bid.id} className="gap-2 overflow-hidden bg-inherit">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium">{bid.title}</CardTitle>
                  <Badge variant="outline" className="bg-amber-50 text-amber-600">
                    Pending
                  </Badge>
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-between">
                  <div className="text-muted-foreground text-sm">
                    <p>Client: {bid.client}</p>
                    <p>Budget: {formatCurrency(bid.bid_price, 'USD')}</p>
                    {bid.daysLeft && <p>Days left to respond: {bid.daysLeft}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      className="bg-inherit"
                      variant="outline"
                      size="sm"
                      onClick={() => handleNagivation(`${PRIVATE_ROUTE.GIGS}/${bid.gig.slug}`)}
                    >
                      View Details
                    </Button>
                    <Button className="bg-inherit" variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </InfiniteScroll>
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          <InfiniteScroll
            dataLength={providerPipeline.length}
            next={loadProviderMore}
            hasMore={pagination.page < pagination.totalPages}
            loader={<Loader isLoading={true} />}
            scrollThreshold={0.9}
            className="space-y-4"
          >
            {providerPipeline.map((bid) => (
              <Card key={bid.id} className="gap-2 overflow-hidden bg-inherit">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium">{bid.title}</CardTitle>
                  <Badge variant="outline" className="bg-amber-50 text-green-600">
                    {formatLabel(bid.gigStatus)}
                  </Badge>
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-between">
                  <div className="text-muted-foreground text-sm">
                    <p>Client: {bid.client}</p>
                    <p>Budget: {formatCurrency(bid.bid_price, 'USD')}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      className="bg-inherit"
                      variant="outline"
                      size="sm"
                      onClick={() => handleNagivation(`${PRIVATE_ROUTE.GIGS}/${bid.gig.slug}`)}
                    >
                      View Details
                    </Button>
                    <Button className="bg-inherit" variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  {bid.status === BID_STATUS.accepted && bid.gigStatus === GIG_STATUS.completed && <div>{getPaymentStatusLabel(bid.gig)}</div>}
                </CardFooter>
              </Card>
            ))}
          </InfiniteScroll>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <InfiniteScroll
            dataLength={providerPipeline.length}
            next={loadProviderMore}
            hasMore={pagination.page < pagination.totalPages}
            loader={<Loader isLoading={true} />}
            scrollThreshold={0.9}
            className="space-y-4"
          >
            {providerPipeline.map((bid) => (
              <Card key={bid.id} className="gap-2 overflow-hidden bg-inherit">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium">{bid.title}</CardTitle>
                  <Badge variant="destructive">Rejected</Badge>
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-between">
                  <div className="text-muted-foreground text-sm">
                    <p>Client: {bid.client}</p>
                    <p>Budget: {formatCurrency(bid.bid_price, 'USD')}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      className="bg-inherit"
                      variant="outline"
                      size="sm"
                      onClick={() => handleNagivation(`${PRIVATE_ROUTE.GIGS}/${bid.gig.slug}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </InfiniteScroll>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PipelinePage = () => {
  const dispatch = useDispatch();

  const { role } = useSelector((state: RootState) => state.user);
  const { loading, userPipelineCounts, providerPipelineCounts, pagination, userPipeline, providerPipeline } = useSelector(
    (state: RootState) => state.gigs
  );

  const [activeUserTab, setActiveUserTab] = useState('open');
  const [activeProviderTab, setActiveProviderTab] = useState('pending');

  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (role === 'user') {
      dispatch(pipelineService.getUserPipeline({ page: 1, status: activeUserTab, limit: 10 }));
    } else {
      dispatch(pipelineService.getProviderPipeline({ page: 1, status: activeProviderTab, limit: 10 }));
    }
  }, [activeUserTab, activeProviderTab, role, dispatch]);

  const handleSubmit = async () => {};

  return (
    <DashboardLayout>
      <Loader isLoading={loading} />
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-6">
          {role === 'user' ? (
            <UserPipelinePage
              activeUserTab={activeUserTab}
              setActiveUserTab={setActiveUserTab}
              setIsReviewDialogOpen={setIsReviewDialogOpen}
              pipeline={userPipeline}
              pagination={pagination}
              counts={userPipelineCounts}
            />
          ) : (
            <ProviderPipelinePage
              activeProviderTab={activeProviderTab}
              setActiveProviderTab={setActiveProviderTab}
              providerPipeline={providerPipeline}
              pagination={pagination}
              counts={providerPipelineCounts || { pending: 0, accepted: 0, rejected: 0 }}
            />
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
