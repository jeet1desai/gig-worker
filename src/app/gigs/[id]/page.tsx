'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Star,
  Clock,
  CheckCircle,
  DollarSign,
  MapPin,
  Briefcase,
  MessageCircle,
  AlertCircle,
  ChevronLeft,
  Share2,
  Flag,
  Bookmark,
  Check,
  FileText,
  Zap,
  Download
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/layouts/layout';

import { formatDate } from '@/lib/date-format';

import { useDispatch } from '@/store/store';
import { gigService } from '@/services/gig.services';
import { useSession } from 'next-auth/react';

const mockGigRequest = {
  id: 1,
  title: 'Need help with calculus homework - derivatives and integrals',
  images: [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=300&fit=crop&crop=entropy&auto=format',
    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=500&h=300&fit=crop&crop=entropy&auto=format'
  ],
  client: {
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&auto=format',
    rating: 4.8,
    reviews: 23,
    memberSince: '2023',
    location: 'New York, NY',
    verified: true,
    totalPosted: 12,
    completionRate: 95
  },
  attachments: [
    {
      name: 'Calculus_Problems.pdf',
      size: '2.4 MB'
    },
    {
      name: 'Course_Syllabus.pdf',
      size: '1.1 MB'
    }
  ],
  budget: '$50-80',
  budgetType: 'Fixed Price',
  timeframe: '2 days',
  urgency: 'High',
  location: 'Remote',
  category: 'Education',
  subcategory: 'Mathematics',
  skills: ['Calculus', 'Mathematics', 'Tutoring', 'Problem Solving'],
  postedAgo: '2 hours ago',
  expires: '5 days',
  applicants: 8,
  status: 'Open',
  description: `I'm a college student struggling with my calculus assignment and need help understanding derivatives and integrals. The assignment is due in 2 days and I really need someone who can explain the concepts clearly and help me solve the problems.

**What I need help with:**
• Understanding the fundamental concepts of derivatives
• Learning integration techniques  
• Solving 10 practice problems with step-by-step explanations
• A brief tutoring session to clarify any doubts

**Requirements:**
• Strong background in calculus and mathematics
• Ability to explain concepts in simple terms
• Available for a 1-2 hour tutoring session via video call
• Provide detailed solutions with explanations

**Timeline:**
Assignment due in 2 days, so I need this completed within 48 hours. Flexible on timing but prefer someone who can start soon.

**What I'll provide:**
• Assignment questions and materials
• Access to my textbook (digital copy)
• Flexibility with scheduling the tutoring session

**Budget:**
Willing to pay $50-80 depending on the quality of explanations and tutoring provided.`,
  bids: [
    {
      id: 1,
      provider: {
        name: 'Dr. Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format',
        rating: 4.9,
        reviews: 156,
        expertise: 'Mathematics PhD, 8 years tutoring experience',
        verified: true,
        responseTime: 'within 2 hours',
        completionRate: 98
      },
      amount: 65,
      timeframe: '24 hours',
      proposal:
        "I have a PhD in Mathematics and 8+ years of tutoring experience. I specialize in calculus and have helped over 100 students master derivatives and integrals. I can provide step-by-step explanations, create visual aids, and offer a comprehensive 90-minute tutoring session via Zoom. I'm available to start immediately and can complete this within 24 hours.",
      postedAgo: '1 hour ago',
      featured: true
    },
    {
      id: 2,
      provider: {
        name: 'Emma Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format',
        rating: 4.7,
        reviews: 89,
        expertise: 'Math tutor specializing in calculus',
        verified: true,
        responseTime: 'within 4 hours',
        completionRate: 94
      },
      amount: 55,
      timeframe: '36 hours',
      proposal:
        'I specialize in calculus tutoring and have helped many students master derivatives and integrals. I use interactive methods and provide detailed written explanations along with practice problems. I can offer flexible scheduling and will provide all solutions with step-by-step breakdowns.',
      postedAgo: '30 minutes ago'
    },
    {
      id: 3,
      provider: {
        name: 'Alex Kim',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format',
        rating: 4.8,
        reviews: 67,
        expertise: 'Engineering student with strong math background',
        verified: false,
        responseTime: 'within 1 hour',
        completionRate: 92
      },
      amount: 45,
      timeframe: '48 hours',
      proposal:
        "As an engineering student, I use calculus daily and have tutored many peers. I can break down complex concepts into easy-to-understand steps and provide practical examples. I'm very responsive and can start working on this immediately.",
      postedAgo: '45 minutes ago'
    }
  ]
};

export default function GigDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data: session } = useSession();

  console.log(session);

  const [gig, setGig] = useState<any>(null);

  useEffect(() => {
    if (id) {
      handleFetchGigDetails(id);
    }
  }, [id]);

  const getDaysBetweenDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleFetchGigDetails = async (id: any) => {
    const response = await dispatch(gigService.getGigById(id) as any);
    if (response && response.data) {
      setGig(response.data);
    }
  };

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

  console.log(gig);

  return (
    <DashboardLayout>
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-6">
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-400 hover:bg-gray-800 hover:text-white">
              <ChevronLeft className="h-4 w-4" />
              Back to Gigs
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="bg-gray-800 text-gray-400 hover:bg-gray-800">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              {/* <Button variant="outline" size="sm" className="bg-gray-800 text-gray-400 hover:bg-gray-800">
                <Flag className="h-4 w-4" />
                Report
              </Button>
              <Button variant="outline" size="sm" className="bg-gray-800 text-gray-400 hover:bg-gray-800">
                <Bookmark className="h-4 w-4" />
                Save
              </Button> */}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-3">
              <Card className="rounded-lg border-gray-700/50 bg-inherit">
                <CardContent className="">
                  <div className="mb-4 flex flex-wrap items-center gap-2 capitalize">
                    <Badge className="bg-green-900/30 text-green-400 hover:bg-green-900/40">
                      <CheckCircle className="mr-1 h-3.5 w-3.5" />
                      {gig?.tier}
                    </Badge>
                    {gig?.keywords?.map((keyword: any) => (
                      <Badge variant="outline" className="border-amber-500/20 bg-amber-500/10 text-amber-400">
                        {keyword}
                      </Badge>
                    ))}

                    <span className="ml-auto text-sm text-gray-400">Posted {formatDate(gig?.created_at)}</span>
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
                          <p className="font-medium text-white">{mockGigRequest.location}</p>
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
                            className="group flex items-center justify-between rounded-lg border border-gray-700 bg-gray-700/30 p-3 transition-colors hover:bg-gray-700/50"
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

              {session?.user?.id === gig?.user_id && (
                <Card className="rounded-lg border-gray-700/50 bg-inherit">
                  <CardContent>
                    <CardTitle className="text-white">Bids ({mockGigRequest.bids.length})</CardTitle>

                    <div className="mt-6 space-y-4">
                      {mockGigRequest.bids.map((bid) => (
                        <Card
                          key={bid.id}
                          className={`relative overflow-hidden border border-gray-700/50 bg-gray-800/30 transition-all hover:border-gray-600/50 ${bid.featured ? 'ring-2 ring-blue-500/30' : ''}`}
                        >
                          {bid.featured && (
                            <div className="absolute top-0 right-0 rounded-bl-md bg-blue-600 px-2 py-1 text-xs font-medium text-white">Featured</div>
                          )}
                          <CardContent className="pt-2">
                            <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                              <div className="flex items-start space-x-4">
                                <Avatar className="h-14 w-14 border-2 border-blue-500/30">
                                  <AvatarImage src={bid.provider.avatar} alt={bid.provider.name} />
                                  <AvatarFallback className="bg-gray-700">
                                    {bid.provider.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="text-lg font-semibold text-white">{bid.provider.name}</h4>
                                    {bid.provider.verified && <CheckCircle className="h-4 w-4 text-blue-400" />}
                                  </div>
                                  <div className="mt-1 flex items-center space-x-2">
                                    <div className="flex items-center">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span className="ml-1 text-sm font-medium text-white">{bid.provider.rating}</span>
                                      <span className="mx-1 text-gray-500">•</span>
                                      <span className="text-sm text-gray-400">{bid.provider.reviews} reviews</span>
                                    </div>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-300">{bid.provider.expertise}</p>
                                </div>
                              </div>

                              <div className="flex flex-col items-end space-y-2 sm:items-end">
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-white">${bid.amount}</div>
                                  <div className="text-sm text-gray-400">Delivery in {bid.timeframe}</div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 border-t border-gray-700/50 pt-4">
                              <h5 className="mb-2 text-sm font-medium text-gray-300">Proposal:</h5>
                              <p className="text-gray-300">{bid.proposal}</p>
                              <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                                <span className="flex items-center">
                                  <Clock className="mr-1 h-3.5 w-3.5" />
                                  Posted {bid.postedAgo}
                                </span>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-500/30 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300"
                                  >
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    Message
                                  </Button>
                                  <Button variant="default" size="sm" className="bg-green-600 text-white hover:bg-green-700">
                                    <Check className="mr-2 h-4 w-4" />
                                    Accept Bid
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <Card className="rounded-lg border-gray-700/50 bg-inherit">
              <CardContent className="text-white">
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
                    <div className="mb-1 flex items-center space-x-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                      <span className="font-medium">{gig?.user?.rating}</span>
                      <span>({gig?.user?.reviews} reviews)</span>
                    </div>
                    <p className="text-sm text-gray-500">{gig?.user?.location}</p>
                  </div>
                </div>

                <div className="mb-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Member since:</span>
                    <span className="font-medium">{formatDate(gig?.user?.created_at)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total posted:</span>
                    <span className="font-medium">{gig?.user?.total_posted} gigs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion rate:</span>
                    <span className="font-medium text-green-600">{gig?.user?.completion_rate}%</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                  <MessageCircle className="h-4 w-4" />
                  Message Client
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-700/50 bg-inherit">
              <CardContent>
                <div className="mb-6">
                  <h3 className="mb-4 text-xl font-semibold text-white">Client Reviews</h3>
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

            {session?.user?.id !== gig?.user_id && (
              <Card className="rounded-lg border-gray-700/50 bg-inherit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <DollarSign className="h-5 w-5" />
                    Place Your Bid
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-white">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                    <AlertCircle className="mr-2 inline h-4 w-4" />
                    This gig expires in {mockGigRequest.expires}. Act fast!
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-medium">Your Bid Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <Input type="number" placeholder="Enter your bid (50-80)" className="h-10 w-full rounded-lg border-gray-600 py-2 pr-4 pl-10" />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Budget range: {mockGigRequest.budget}</p>
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-medium">Delivery Time</Label>
                    <Select>
                      <SelectTrigger className="!h-10 w-full rounded-lg border-gray-600 px-4 py-2">
                        <SelectValue placeholder="Select a delivery time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 day">1 day</SelectItem>
                        <SelectItem value="2 days">2 days</SelectItem>
                        <SelectItem value="3 days">3 days</SelectItem>
                        <SelectItem value="1 week">1 week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-medium">Cover Letter</Label>
                    <Textarea
                      rows={4}
                      placeholder="Explain why you're the perfect fit for this project..."
                      className="w-full rounded-lg border-gray-600 bg-inherit px-4 py-2"
                    />
                    <p className="mt-1 text-xs text-gray-500">Min. 100 characters recommended</p>
                  </div>

                  <div className="border-t border-gray-700/50 pt-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Service fee (5%):</span>
                      <span className="text-gray-600">-$3.25</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>You'll receive:</span>
                      <span className="text-green-600">$61.75</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">Submit Bid</Button>
                </CardContent>
              </Card>
            )}

            <Card className="rounded-lg border-gray-700/50 bg-inherit">
              <CardHeader>
                <CardTitle className="text-white">Similar Gigs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white">Similar Gigs</CardContent>
            </Card>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
