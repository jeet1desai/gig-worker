'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, DollarSign, FileText, MapPin, Star, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { formatDate } from '@/lib/date-format';

import { RootState, useDispatch, useSelector } from '@/store/store';
import { gigService } from '@/services/gig.services';

export default function WorkDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.gigs);

  const [gig, setGig] = useState<any>(null);

  useEffect(() => {
    if (id) {
      handleFetchGigDetails(id);
    }
  }, [id]);

  const handleFetchGigDetails = async (id: any) => {
    const response = await dispatch(gigService.getPublicGigDetailById(id) as any);
    if (response && response.data) {
      setGig(response.data);
    }
  };

  const handleApply = () => {
    router.push(`/gigs/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="mb-4 h-10 w-48" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <div className="pt-4">
                <Skeleton className="mb-4 h-6 w-32" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-6 w-20 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!gig) {
    return null;
  }

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

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <Header />

      <div className="container mx-auto my-4 px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gigs
        </Button>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            {gig.thumbnail && (
              <div className="overflow-hidden rounded-lg">
                <img src={gig.thumbnail} alt={gig.title} className="h-[300px] w-full object-cover" />
              </div>
            )}

            <Card className="rounded-lg bg-black text-white shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{gig.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center text-sm">
                  <span>Posted {formatDate(gig.created_at)}</span>
                  <span className="mx-2">•</span>
                  <span>{gig.proposals || 0} proposals</span>
                </div>

                <div className="prose max-w-none">
                  <p className="mb-4 text-gray-300">{gig.description}</p>
                </div>

                <div className="mt-6">
                  <h3 className="mb-3 text-lg font-medium">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {gig.keywords.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg bg-black text-white shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">About the Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={gig.user.profile_url} />
                    <AvatarFallback>
                      <User className="h-8 w-8 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{gig.user.first_name + ' ' + gig.user.last_name}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-600">
                      <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>
                        {gig.user.rating} ({gig.user.completedProjects} jobs)
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Member since {formatDate(gig.user.created_at).split(', ')[1]} {gig.location && '•'} {gig.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {gig.attachments?.length > 0 && (
              <Card className="rounded-lg bg-black text-white shadow-none">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {gig.attachments.map((file: any, index: number) => (
                      <div
                        key={index}
                        className="hover:bg-accent flex cursor-pointer items-center justify-between rounded-md p-2"
                        onClick={() => downloadFile(file)}
                      >
                        <div className="flex items-center">
                          <FileText className="mr-2 h-5 w-5 text-gray-400" />
                          <span className="line-clamp-1 text-sm font-medium text-gray-300">{file.split('/').pop()}</span>
                        </div>
                        <span className="text-xs text-gray-300">12MB</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="rounded-lg bg-black text-white shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <DollarSign className="mt-0.5 mr-3 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-medium">
                      ${gig.price_range.min} - ${gig.price_range.max}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="mt-0.5 mr-3 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{gig.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="mt-0.5 mr-3 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Posted</p>
                    <p className="font-medium">{formatDate(gig.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="mt-0.5 mr-3 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Deadline</p>
                    <p className="font-medium">{formatDate(gig.end_date)}</p>
                  </div>
                </div>
              </CardContent>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg" onClick={handleApply}>
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
