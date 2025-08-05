'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Star,
  Clock,
  CheckCircle,
  DollarSign,
  MapPin,
  MessageCircle,
  AlertCircle,
  ChevronLeft,
  Share2,
  Check,
  FileText,
  Download,
  Loader2,
  X,
  FolderX
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Form, Formik, FormikHelpers } from 'formik';
import InfiniteScroll from 'react-infinite-scroll-component';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/components/layouts/layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatOnlyDate, getDaysBetweenDates } from '@/lib/date-format';
import notificationHelper from '@/lib/utils/notifications';
import { GIG_STATUS, NOTIFICATION_TYPE, ROLE } from '@prisma/client';
import { RootState, useDispatch, useSelector } from '@/store/store';
import { gigService } from '@/services/gig.services';
import { PRIVATE_API_ROUTES, PRIVATE_ROUTE } from '@/constants/app-routes';
import GigDetailsShimmer from '@/components/shimmer/GigDetailsShimmer';
import GigReviewModal from '@/components/gigs/GigReviewModal';
import { setLoading } from '@/store/slices/gigs';
import apiService from '@/services/api';
import { CreateProvidersReviewAPIResponse } from '@/types/fe';
import { toast } from '@/lib/toast';
import Loader from '@/components/Loader';

export default function GigDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data: session } = useSession();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { loading, bids, pagination } = useSelector((state: RootState) => state.gigs);
  const [gig, setGig] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedGigForReview, setSelectedGigForReview] = useState<any>(null);

  useEffect(() => {
    if (id) {
      handleFetchGigDetails(id as string);
    }
  }, [id]);

  const handleFetchGigDetails = async (id: string) => {
    try {
      const response = await dispatch(gigService.getGigById(id) as any);
      if (response && response.data) {
        setGig(response.data);

        await dispatch(gigService.getBidsByGigId(id, 1, 5) as any);
      }
    } catch (error) {
      console.error('Error fetching gig details:', error);
    }
  };

  const loadMore = useCallback(async () => {
    if (pagination.page < pagination.totalPages) {
      await dispatch(gigService.getBidsByGigId(id?.toString() || '', pagination.page + 1, 5) as any);
    }
  }, [pagination.page, pagination.totalPages]);

  const downloadFile = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileUrl.split('/').pop() || 'download');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handlePostBidSubmit = async (values: any, { setSubmitting, resetForm }: FormikHelpers<any>) => {
    setSubmitting(true);
    try {
      const response = await dispatch(
        gigService.createBid(gig.id?.toString() || '', { proposal: values.proposal, bidPrice: values.bidPrice }) as any
      );
      if (response && response.data) {
        notificationHelper.sendNotification(response.data.user_id, {
          title: 'New Bid Received',
          message: `You have received a new bid on your gig "${response.data.gig.title}"`,
          type: NOTIFICATION_TYPE.info,
          module: 'gigs',
          relatedId: response.data.id
        });
        setSubmitting(false);
        setGig((prevGig: any) => ({ ...prevGig, hasBid: true }));
        resetForm();
      }
    } catch (error: any) {
      console.error('Error creating bid:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBidStatus = async (bidId: string, status: string) => {
    try {
      const response = await dispatch(gigService.updateBidStatus(bidId, { status }) as any);
      if (response && response.data) {
        notificationHelper.sendNotification(response.data.bid.provider_id, {
          title: 'Bid Status Updated',
          message: `Your bid for "${response.data.bid.gig.title}" has been ${status}`,
          type: NOTIFICATION_TYPE.info,
          module: 'gigs',
          relatedId: response.data.bid.id
        });
      }
    } catch (error: any) {
      console.error('Error updating bid status:', error);
    }
  };

  const handleCompleteGig = async (gigId: string) => {
    dispatch(setLoading({ loading: true }));
    try {
      const response = await apiService.post<CreateProvidersReviewAPIResponse>(
        `${PRIVATE_API_ROUTES.GIG_MARK_COMPLETE_PROVIDER_API}/${gigId}`,
        {},
        {
          withAuth: true
        }
      );

      if (response.data.message) {
        const response_data = await dispatch(gigService.getGigById(id as string));
        if (response_data && response_data.data) {
          setGig(response_data.data);
        }
        toast.success(response.data.message);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.message || 'Error while marking gig as completed';
      toast.error(message);
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  const handleReviewGig = (gigId: string, gigTitle: string, accepted_bid: { [key: string]: any }) => {
    setSelectedGigForReview({
      id: gigId,
      title: gigTitle,
      bidAmount: accepted_bid?.bid_price,
      providerName: `${accepted_bid?.provider?.first_name} ${accepted_bid?.provider?.last_name}`
    });
    setIsReviewModalOpen(true);
  };

  if (!gig) {
    return (
      <DashboardLayout>
        <GigDetailsShimmer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Loader isLoading={loading} />
      <main
        className="min-h-screen py-8"
        style={{ filter: loading || !gig ? 'blur(2px)' : 'none', pointerEvents: loading || !gig ? 'none' : 'auto' }}
      >
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-400 hover:bg-gray-800 hover:text-white">
              <ChevronLeft className="h-4 w-4" />
              Back to Gigs
            </Button>
            <div className="flex items-center space-x-2">
              {gig?.pipeline?.status === GIG_STATUS.completed && session?.user.role === ROLE.user && (
                <Button
                  onClick={() => handleReviewGig(gig?.id, gig?.title, gig?.accepted_bid)}
                  variant="outline"
                  className="border-blue-500 bg-transparent text-blue-500 hover:bg-blue-900/20 hover:text-blue-400"
                >
                  <Star className="mr-2 h-4 w-4" />
                  Review & Pay
                </Button>
              )}
              {gig?.pipeline?.status === GIG_STATUS.in_progress && session?.user.role === ROLE.provider && (
                <Button
                  onClick={() => handleCompleteGig(gig.id)}
                  variant="outline"
                  className="border-green-500 bg-transparent text-green-500 hover:bg-green-900/20 hover:text-green-400"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete
                </Button>
              )}
              <Button variant="outline" size="sm" className="bg-gray-800 text-gray-400 hover:bg-gray-800">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {gig?.thumbnail && (
                <div className="overflow-hidden rounded-lg border border-gray-700/50">
                  <img src={gig?.thumbnail} alt={gig?.title} className="h-[270px] w-full object-fill" />
                </div>
              )}

              <Card className="rounded-lg border-gray-700/50 bg-inherit">
                <CardContent className="">
                  <div className="mb-4 flex flex-wrap items-center gap-2 capitalize">
                    <Badge className="bg-green-900/30 text-green-400 hover:bg-green-900/40">
                      <CheckCircle className="mr-1 h-3.5 w-3.5" />
                      {gig?.tier}
                    </Badge>
                    {gig?.keywords?.map((keyword: string) => (
                      <Badge key={keyword} variant="outline" className="border-amber-500/20 bg-amber-500/10 text-amber-400">
                        {keyword}
                      </Badge>
                    ))}

                    <span className="ml-auto text-sm text-gray-400">Posted {formatOnlyDate(gig?.created_at)}</span>
                  </div>

                  <h1 className="mb-4 text-2xl font-bold text-white">{gig?.title}</h1>

                  <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Budget</p>
                          <p className="font-medium text-white">
                            ${gig?.price_range?.min} - ${gig?.price_range?.max}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">Timeline</p>
                          <div className="space-y-1">
                            <p className="font-medium text-white">{getDaysBetweenDates(gig?.start_date, gig?.end_date)} days</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">Location</p>
                          <p className="font-medium text-white">{gig?.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="mb-3 text-lg font-semibold text-white">Description</h3>
                    <div className="text-gray-300">{gig?.description}</div>
                  </div>

                  {gig?.attachments && gig?.attachments.length > 0 && (
                    <div className="">
                      <h3 className="mb-3 text-lg font-semibold text-white">Attachments</h3>
                      <div className="space-y-2">
                        {gig?.attachments.map((file: any, i: any) => (
                          <div
                            key={i}
                            className="group flex items-center justify-between rounded-lg border border-gray-700/50 p-3 transition-colors hover:bg-gray-700/50"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-900/20 text-blue-400">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="line-clamp-1 text-sm font-medium text-white">{file.split('/').pop()}</p>
                                <p className="text-xs text-gray-400">20MB</p>
                              </div>
                            </div>
                            <Button onClick={() => downloadFile(file)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400" title="Download">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-lg border-gray-700/50 bg-inherit">
                <CardContent className="text-white">
                  <div className="flex items-start justify-between">
                    <div className="mb-4 flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={gig?.user?.profile_url} />
                        <AvatarFallback>
                          {gig?.user?.first_name
                            .split(' ')
                            .map((n: any) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{gig?.user?.first_name + ' ' + gig?.user?.last_name}</h3>
                          {gig?.user?.is_verified && <CheckCircle className="h-4 w-4 text-blue-600" />}
                        </div>
                        <p className="text-sm text-gray-500">{gig?.user?.location}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="mr-2 text-3xl font-bold text-white">4.8</div>
                      <div className="mr-4">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`h-5 w-5 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                          ))}
                        </div>
                        <div className="text-sm text-gray-400">Based on 24 reviews</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 grid grid-cols-1 gap-4 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Member since:</span>
                      <span className="text-card-foreground font-semibold">{formatOnlyDate(gig?.user?.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Total posted:</span>
                      <span className="text-card-foreground font-semibold">{gig?.user?.total_posted} gigs</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Completion rate:</span>
                      <span className="text-success font-semibold">{gig?.user?.completion_rate}%</span>
                    </div>
                  </div>
                </CardContent>
                <CardContent>
                  <h3 className="mb-6 text-xl font-semibold text-white">Client Reviews</h3>

                  <div className="space-y-6">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border-b border-gray-700/50 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={`https://randomuser.me/api/portraits/${review % 2 === 0 ? 'men' : 'women'}/${40 + review}.jpg`} />
                              <AvatarFallback>U{review}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-white">User {review}</h4>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className={`h-4 w-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-400">2 weeks ago</span>
                        </div>
                        <p className="mt-3 text-gray-300">
                          {review === 1
                            ? 'Great experience working with this client. Clear communication and prompt payment. Highly recommended!'
                            : review === 2
                              ? 'The work was completed on time and exceeded my expectations. Will definitely work with again.'
                              : 'Professional and skilled worker. Delivered exactly what was promised.'}
                        </p>
                      </div>
                    ))}
                    <Button variant="outline" className="mt-4 w-full border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                      View All Reviews
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              {session?.user?.id === gig?.user_id && Object.keys(gig?.accepted_bid || {}).length <= 0 && (
                <Card className="rounded-lg border-gray-700/50 bg-inherit p-0">
                  <CardContent className="p-4">
                    <CardTitle className="text-white">Bids ({bids.length || 0})</CardTitle>

                    <div className="mt-4 overflow-auto lg:h-[calc(100vh-16rem)]" id="bids-scroll-container" ref={scrollContainerRef}>
                      {bids.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700/50 p-8 text-center">
                          <FolderX className="h-12 w-12 text-gray-500" />
                          <h3 className="mt-2 text-lg font-medium text-gray-300">No bids yet</h3>
                          <p className="mt-1 text-sm text-gray-500">Your gig hasn&apos;t received any bids yet. Check back later!</p>
                        </div>
                      ) : (
                        <ScrollArea className="space-y-4">
                          <InfiniteScroll
                            dataLength={bids.length}
                            next={loadMore}
                            hasMore={pagination.page < pagination.totalPages}
                            loader={<div className="col-span-2 py-4 text-center text-sm text-gray-400">Loading more bids...</div>}
                            scrollThreshold={0.9}
                            scrollableTarget={scrollContainerRef.current ? 'bids-scroll-container' : undefined}
                            className="space-y-4"
                          >
                            {bids.map((bid: any) => {
                              return (
                                <Card
                                  key={bid.id}
                                  className={`relative overflow-hidden border border-gray-700/50 bg-gray-800/30 p-0 transition-all hover:border-gray-600/50 ${bid.featured ? 'ring-2 ring-blue-500/30' : ''}`}
                                >
                                  {/* <div className="absolute top-0 right-0 rounded-bl-md bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                                  Featured
                                </div> */}
                                  <CardContent className="p-4">
                                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                                      <div className="flex items-start space-x-4">
                                        <Avatar className="h-14 w-14 border-2 border-blue-500/30">
                                          <AvatarImage src={bid.provider.profile_url} alt={bid.provider.first_name} />
                                          <AvatarFallback className="bg-gray-700">
                                            {bid.provider.first_name
                                              .split(' ')
                                              .map((n: string) => n[0])
                                              .join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <div className="flex items-center space-x-2">
                                            <h4 className="text-lg font-semibold text-white">
                                              {bid.provider.first_name} {bid.provider.last_name}
                                            </h4>
                                            {bid.provider.is_verified && <CheckCircle className="h-4 w-4 text-blue-400" />}
                                          </div>
                                          <div className="mt-1 flex items-center space-x-2">
                                            <div className="flex items-center">
                                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                              <span className="ml-1 text-sm font-medium text-white">{4}</span>
                                              <span className="mx-1 text-gray-500">•</span>
                                              <span className="text-sm text-gray-400">{4} reviews</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex flex-col items-end space-y-2 sm:items-end">
                                        <div className="text-right">
                                          <div className="text-2xl font-bold text-white">${bid.bid_price}</div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mt-4 border-t border-gray-700/50 pt-4">
                                      <h5 className="mb-2 text-sm font-medium text-gray-300">Proposal:</h5>
                                      <p className="break-all text-gray-300">{bid.proposal}</p>
                                      <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                                        <span className="flex items-center">
                                          <Clock className="mr-1 h-3.5 w-3.5" />
                                          Posted {formatOnlyDate(bid.created_at)}
                                        </span>
                                        <div className="flex space-x-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-blue-500/30 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300"
                                          >
                                            <MessageCircle className="h-4 w-4" />
                                          </Button>
                                          {bid.status === 'pending' && (
                                            <>
                                              <Button
                                                onClick={() => handleUpdateBidStatus(bid.id, 'accept')}
                                                variant="default"
                                                size="sm"
                                                className="bg-green-600 text-white hover:bg-green-700"
                                                disabled={loading}
                                              >
                                                <Check className="h-4 w-4" />
                                              </Button>
                                              <Button
                                                onClick={() => handleUpdateBidStatus(bid.id, 'reject')}
                                                variant="default"
                                                size="sm"
                                                className="bg-red-600 text-white hover:bg-red-700"
                                                disabled={loading}
                                              >
                                                <X className="h-4 w-4" />
                                              </Button>
                                            </>
                                          )}
                                          {bid.status === 'accepted' && (
                                            <Button variant="default" size="sm" className="bg-green-600 text-white hover:bg-green-700">
                                              Accepted
                                            </Button>
                                          )}
                                          {bid.status === 'rejected' && (
                                            <Button variant="default" size="sm" className="bg-red-600 text-white hover:bg-red-700">
                                              Rejected
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </InfiniteScroll>
                        </ScrollArea>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              {session?.user?.id === gig?.user_id && Object.keys(gig?.accepted_bid || {}).length > 0 && (
                <Card className="rounded-lg border-gray-700/50 bg-inherit p-0">
                  <CardContent className="p-4">
                    <CardTitle className="text-white">Accepted Bid</CardTitle>

                    <div className="mt-4 overflow-auto lg:h-[calc(100vh-16rem)]" id="bids-scroll-container" ref={scrollContainerRef}>
                      <Card
                        key={gig?.accepted_bid.id}
                        className={`relative overflow-hidden border border-gray-700/50 bg-gray-800/30 p-0 transition-all hover:border-gray-600/50 ${gig?.accepted_bid.featured ? 'ring-2 ring-blue-500/30' : ''}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                            <div className="flex items-start space-x-4">
                              <Avatar className="h-14 w-14 border-2 border-blue-500/30">
                                <AvatarImage src={gig?.accepted_bid.provider.profile_url} alt={gig?.accepted_bid.provider.first_name} />
                                <AvatarFallback className="bg-gray-700">
                                  {gig?.accepted_bid.provider.first_name
                                    .split(' ')
                                    .map((n: string) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h4 className="text-lg font-semibold text-white">
                                    {gig?.accepted_bid.provider.first_name} {gig?.accepted_bid.provider.last_name}
                                  </h4>
                                  {gig?.accepted_bid.provider.is_verified && <CheckCircle className="h-4 w-4 text-blue-400" />}
                                </div>
                                <div className="mt-1 flex items-center space-x-2">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="ml-1 text-sm font-medium text-white">{4}</span>
                                    <span className="mx-1 text-gray-500">•</span>
                                    <span className="text-sm text-gray-400">{4} reviews</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end space-y-2 sm:items-end">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-white">${gig?.accepted_bid?.bid_price}</div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 border-t border-gray-700/50 pt-4">
                            <h5 className="mb-2 text-sm font-medium text-gray-300">Proposal:</h5>
                            <p className="text-gray-300">{gig?.accepted_bid?.proposal}</p>
                            <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                              <span className="flex items-center">
                                <Clock className="mr-1 h-3.5 w-3.5" />
                                Posted {formatOnlyDate(gig?.accepted_bid?.created_at)}
                              </span>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-500/30 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                                {gig?.accepted_bid?.status === 'accepted' && (
                                  <Button variant="default" size="sm" className="bg-green-600 text-white hover:bg-green-700">
                                    Accepted
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}
              {session?.user?.id !== gig?.user_id && (
                <Card className="rounded-lg border-gray-700/50 bg-inherit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <DollarSign className="h-5 w-5" />
                      Place Your Bid
                    </CardTitle>
                  </CardHeader>
                  {gig?.hasBid ? (
                    <CardContent className="space-y-4 text-white">
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                        <AlertCircle className="mr-2 inline h-4 w-4" />
                        You have already placed a bid for this gig.
                      </div>
                    </CardContent>
                  ) : (
                    (gig?.pipeline?.status === GIG_STATUS.open || gig?.pipeline?.status === GIG_STATUS.requested) && (
                      <CardContent className="space-y-4 text-white">
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                          <AlertCircle className="mr-2 inline h-4 w-4" />
                          This gig expires in {new Date(gig?.end_date).toLocaleDateString()}. Act fast!
                        </div>

                        <Formik
                          initialValues={{ proposal: '', bidPrice: '' }}
                          enableReinitialize
                          validationSchema={Yup.object().shape({
                            proposal: Yup.string().required('Required').min(100, 'Too Short!'),
                            bidPrice: Yup.number().required('Required')
                          })}
                          onSubmit={handlePostBidSubmit}
                        >
                          {({ isSubmitting, errors, touched, handleSubmit, getFieldProps }) => {
                            return (
                              <Form noValidate onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="bidPrice" className="mb-2 block text-sm font-medium">
                                      Your Bid Amount
                                    </Label>
                                    <div className="relative">
                                      <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                      <Input
                                        id="bidPrice"
                                        type="number"
                                        step="0.1"
                                        placeholder={`Enter your bid (${gig?.price_range?.min || 0}-${gig?.price_range?.max || 'N/A'})`}
                                        className="h-10 w-full rounded-lg border-gray-600 bg-inherit py-2 pr-4 pl-10"
                                        {...getFieldProps('bidPrice')}
                                      />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                      Budget range: ${gig?.price_range?.min || 0} - ${gig?.price_range?.max || 'N/A'}
                                    </p>
                                    {errors.bidPrice && touched.bidPrice && <div className="text-sm text-red-500">{errors.bidPrice}</div>}
                                  </div>

                                  <div>
                                    <Label htmlFor="proposal" className="mb-2 block text-sm font-medium">
                                      Cover Letter
                                    </Label>
                                    <Textarea
                                      id="proposal"
                                      rows={4}
                                      minLength={100}
                                      placeholder="Explain why you're the perfect fit for this project..."
                                      className="w-full rounded-lg border-gray-600 bg-inherit px-4 py-2"
                                      {...getFieldProps('proposal')}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Min. 100 characters recommended</p>
                                    {errors.proposal && touched.proposal && <div className="text-sm text-red-500">{errors.proposal}</div>}
                                  </div>

                                  <div className="border-t border-gray-700/50 pt-4">
                                    <div className="mb-2 flex justify-between text-sm">
                                      <span>Service fee (5%):</span>
                                      <span className="text-gray-400">Calculated after bid</span>
                                    </div>
                                  </div>

                                  <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
                                  >
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit Bid'}
                                  </Button>
                                </div>
                              </Form>
                            );
                          }}
                        </Formik>
                      </CardContent>
                    )
                  )}
                </Card>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <Card className="rounded-lg border-gray-700/50 bg-inherit">
              <CardHeader>
                <CardTitle className="text-white">Similar Gigs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white">
                <SimilarGigs currentGigId={gig?.id?.toString() || ''} />
              </CardContent>
            </Card>
          </div>
        </div>
        {selectedGigForReview && (
          <GigReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => {
              setIsReviewModalOpen(false);
              setSelectedGigForReview(null);
            }}
            gigId={selectedGigForReview.id}
            gigTitle={selectedGigForReview.title}
            bidAmount={selectedGigForReview.bidAmount}
            providerName={selectedGigForReview.providerName}
          />
        )}
      </main>
    </DashboardLayout>
  );
}

function SimilarGigs({ currentGigId }: { currentGigId: string }) {
  const [similarGigs, setSimilarGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSimilarGigs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/gigs/${currentGigId}/similar`);
        const data = await response.json();
        if (data.success) {
          setSimilarGigs(data.data);
        }
      } catch (error) {
        console.error('Error fetching similar gigs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentGigId) {
      fetchSimilarGigs();
    }
  }, [currentGigId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!similarGigs.length) {
    return (
      <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-6 text-center">
        <FolderX className="mx-auto h-12 w-12 text-gray-500" />
        <p className="mt-2 text-gray-400">No similar gigs found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-1">
      {similarGigs.map((gig) => {
        return (
          <Card
            key={gig.id}
            className="cursor-pointer gap-2 border-gray-700/50 bg-gray-800/50 p-4 transition-colors hover:border-blue-500/50 hover:bg-gray-700/50"
            onClick={() => router.push(`${PRIVATE_ROUTE.GIGS}/${gig.slug}`)}
          >
            <CardHeader className="p-0">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={gig.user?.profile_url || ''} alt={gig.user?.first_name} />
                  <AvatarFallback>
                    {gig.user?.first_name?.[0]}
                    {gig.user?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="line-clamp-1 font-medium text-white">{gig.title}</h3>
                  <p className="text-sm text-gray-400">
                    {gig.user?.first_name} {gig.user?.last_name}{' '}
                    <span className="text-gray-400">
                      (${gig.price_range?.min} - ${gig.price_range?.max})
                    </span>
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <p className="line-clamp-2 text-sm text-gray-300">{gig.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
