'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Star,
  Clock,
  CheckCircle,
  DollarSign,
  MapPin,
  User,
  Briefcase,
  MessageCircle,
  AlertCircle,
  Heart,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/layouts/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const mockGigRequest = {
  id: 1,
  title: 'Need help with calculus homework - derivatives and integrals',
  images: [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=300&fit=crop&crop=entropy&auto=format',
    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=500&h=300&fit=crop&crop=entropy&auto=format',
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
    completionRate: 95,
  },
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

  requirements: [
    "Bachelor's degree in Mathematics or related field",
    'Previous tutoring experience preferred',
    'Available for video call sessions',
    'Fluent in English',
  ],

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
        completionRate: 98,
      },
      amount: 65,
      timeframe: '24 hours',
      proposal:
        "I have a PhD in Mathematics and 8+ years of tutoring experience. I specialize in calculus and have helped over 100 students master derivatives and integrals. I can provide step-by-step explanations, create visual aids, and offer a comprehensive 90-minute tutoring session via Zoom. I'm available to start immediately and can complete this within 24 hours.",
      postedAgo: '1 hour ago',
      featured: true,
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
        completionRate: 94,
      },
      amount: 55,
      timeframe: '36 hours',
      proposal:
        'I specialize in calculus tutoring and have helped many students master derivatives and integrals. I use interactive methods and provide detailed written explanations along with practice problems. I can offer flexible scheduling and will provide all solutions with step-by-step breakdowns.',
      postedAgo: '30 minutes ago',
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
        completionRate: 92,
      },
      amount: 45,
      timeframe: '48 hours',
      proposal:
        "As an engineering student, I use calculus daily and have tutored many peers. I can break down complex concepts into easy-to-understand steps and provide practical examples. I'm very responsive and can start working on this immediately.",
      postedAgo: '45 minutes ago',
    },
  ],
};

export default function GigDetailPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {}, []);

  return (
    <DashboardLayout>
      <main className="space-y-4 p-3 pl-5 sm:space-y-6 sm:p-4 md:p-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="rounded-lg border-gray-700/50 bg-inherit">
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Open
                      </Badge>
                      <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-400">
                        High Priority
                      </Badge>
                    </div>

                    <CardTitle className="mb-3 text-2xl text-white">{mockGigRequest.title}</CardTitle>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 md:grid-cols-4">
                      <div className="flex items-center space-x-2">
                        <div className="rounded-lg bg-teal-100 p-1.5 dark:bg-teal-900/30">
                          <DollarSign className="size-4" />
                        </div>
                        <div>
                          <span className="font-semibold text-green-600">{mockGigRequest.budget}</span>
                          <p className="text-xs text-gray-500">{mockGigRequest.budgetType}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="rounded-lg bg-purple-100 p-1.5 dark:bg-purple-900/30">
                          <Clock className="size-4" />
                        </div>
                        <div>
                          <span className="font-medium text-white">{mockGigRequest.timeframe}</span>
                          <p className="text-xs text-gray-500">Timeline</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="rounded-lg bg-blue-100 p-1.5 dark:bg-blue-900/30">
                          <Heart className="size-4" />
                        </div>
                        <div>
                          <span className="font-medium text-white">{mockGigRequest.location}</span>
                          <p className="text-xs text-gray-500">Location</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="rounded-lg bg-gray-100 p-1.5 dark:bg-gray-700">
                          <MapPin className="size-4" />
                        </div>
                        <div>
                          <span className="font-medium text-white">{mockGigRequest.applicants} bids</span>
                          <p className="text-xs text-gray-500">Received</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {mockGigRequest.images && mockGigRequest.images.length > 0 && (
              <Card className="rounded-lg border-gray-700/50 bg-inherit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Briefcase className="size-4" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {mockGigRequest.images.map((image, index) => (
                      <div key={index} className="overflow-hidden rounded-lg border">
                        <img
                          src={image}
                          alt={`Attachment ${index + 1}`}
                          className="h-48 w-full cursor-pointer object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800 p-1">
                <TabsTrigger value="description" className="text-gray-100 data-[state=active]:text-black">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Description
                </TabsTrigger>
                <TabsTrigger value="ratings" className="text-gray-100 data-[state=active]:text-black">
                  <Star className="mr-2 h-4 w-4" />
                  Ratings
                </TabsTrigger>
                <TabsTrigger value="bids" className="text-gray-100 data-[state=active]:text-black">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Bids ({mockGigRequest.applicants})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4">
                <Card className="rounded-lg border-gray-700/50 bg-inherit">
                  <CardContent className="text-white">
                    <div className="prose max-w-none">
                      <div className="leading-relaxed whitespace-pre-line">{mockGigRequest.description}</div>
                    </div>

                    <div className="mt-6">
                      <h3 className="mb-3 flex items-center gap-2 font-semibold">
                        <Briefcase className="h-4 w-4" />
                        Skills Required
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {mockGigRequest.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ratings" className="space-y-6">
                <Card className="rounded-lg border-gray-700/50 bg-inherit">
                  <CardContent className="text-white">
                    <div className="mb-4 flex items-center sm:mb-0">
                      <div className="mr-4 text-5xl font-bold">4.8</div>
                      <div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-gray-400">Based on 24 reviews</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center">
                          <div className="flex w-16 items-center">
                            <span className="text-sm font-medium text-gray-300">{rating} star</span>
                            <Star className="ml-1 h-4 w-4 text-yellow-400" />
                          </div>
                          <div className="mx-2 h-2 flex-1 overflow-hidden rounded-full bg-gray-700">
                            <div className="h-full bg-yellow-400" style={{ width: `${[75, 17, 4, 3, 1][5 - rating]}%` }} />
                          </div>
                          <span className="ml-2 w-8 text-right text-sm text-gray-400">{[18, 4, 1, 1, 0][5 - rating]}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <Separator className="bg-gray-700/50" />

                  {[
                    {
                      id: 1,
                      user: {
                        name: 'Alex Johnson',
                        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                        location: 'New York, USA',
                        joinDate: '2022',
                      },
                      rating: 5,
                      date: '2 days ago',
                      comment:
                        'Exceptional service! The provider went above and beyond to deliver high-quality work. Very professional and communicative throughout the entire process. I would definitely hire again.',
                      likes: 8,
                      isLiked: false,
                      gig: 'Calculus Tutoring Session',
                      gigPrice: 65,
                    },
                    {
                      id: 2,
                      user: {
                        name: 'Sarah Williams',
                        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
                        location: 'London, UK',
                        joinDate: '2021',
                      },
                      rating: 4,
                      date: '1 week ago',
                      comment:
                        'Good work overall. The delivery was a bit delayed but the quality was worth the wait. The tutor explained complex concepts in a simple way that was easy to understand.',
                      likes: 5,
                      isLiked: true,
                      gig: 'Advanced Mathematics Help',
                      gigPrice: 75,
                    },
                    {
                      id: 3,
                      user: {
                        name: 'Michael Chen',
                        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
                        location: 'Toronto, Canada',
                        joinDate: '2023',
                      },
                      rating: 5,
                      date: '2 weeks ago',
                      comment:
                        'Absolutely brilliant! The tutor was extremely knowledgeable and patient. They provided detailed explanations and made sure I understood every concept before moving on. Highly recommended!',
                      likes: 12,
                      isLiked: false,
                      gig: 'Calculus Homework Help',
                      gigPrice: 55,
                    },
                  ].map((review) => (
                    <>
                      <Card key={review.id} className="rounded-none border-0 !border-b border-gray-700/50 bg-inherit p-0 pb-4">
                        <CardContent className="text-white">
                          <div className="mb-4 flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={review.user.avatar} />
                                <AvatarFallback>
                                  {review.user.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center">
                                  <h4 className="font-medium text-white">{review.user.name}</h4>
                                  <CheckCircle className="ml-2 h-4 w-4 text-blue-500" />
                                </div>
                                <div className="mt-1 flex items-center text-sm text-gray-400">
                                  <span>{review.user.location}</span>
                                  <span className="mx-2">•</span>
                                  <span>Member since {review.user.joinDate}</span>
                                </div>
                                <div className="mt-1 flex items-center">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="ml-2 text-sm text-gray-400">{review.date}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 rounded-full ${review.isLiked ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`}
                              >
                                <ThumbsUp className={`h-4 w-4 ${review.isLiked ? 'fill-current' : ''}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 rounded-full ${review.isLiked === false ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                              >
                                <ThumbsDown className={`h-4 w-4 ${review.isLiked === false ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="mb-2 flex items-center text-sm">
                              <span className="font-medium text-gray-300">{review.gig}</span>
                              <span className="mx-2 text-gray-500">•</span>
                              <span className="text-blue-400">${review.gigPrice}</span>
                            </div>
                            <p className="text-gray-300">{review.comment}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ))}
                </Card>
              </TabsContent>

              <TabsContent value="bids" className="space-y-6">
                {mockGigRequest.bids.map((bid) => (
                  <Card key={bid.id} className="rounded-lg border-gray-700/50 bg-inherit">
                    <CardContent className="text-white">
                      {bid.featured && (
                        <div className="mb-4 w-fit rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-xs font-medium text-white">
                          ⭐ Featured Bid
                        </div>
                      )}

                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={bid.provider.avatar} />
                            <AvatarFallback>
                              {bid.provider.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="mb-1 flex items-center gap-2">
                              <h4 className="text-lg font-semibold">{bid.provider.name}</h4>
                              {bid.provider.verified && <CheckCircle className="h-4 w-4 text-blue-600" />}
                            </div>
                            <p className="mb-2 text-sm text-gray-600">{bid.provider.expertise}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-current text-yellow-500" />
                                <span className="font-medium">{bid.provider.rating}</span>
                                <span>({bid.provider.reviews} reviews)</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>Responds {bid.provider.responseTime}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="h-4 w-4" />
                                <span>{bid.provider.completionRate}% completion</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">${bid.amount}</div>
                          <div className="text-sm text-gray-500">in {bid.timeframe}</div>
                        </div>
                      </div>

                      <p className="mb-4 leading-relaxed text-white">{bid.proposal}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Bid placed {bid.postedAgo}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-400"
                          >
                            <User className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-400"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button size="default" className="bg-green-600 hover:bg-green-700">
                            Accept Bid
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="rounded-lg border-gray-700/50 bg-inherit">
              <CardContent className="text-white">
                <div className="mb-4 flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={mockGigRequest.client.avatar} />
                    <AvatarFallback>
                      {mockGigRequest.client.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{mockGigRequest.client.name}</h3>
                      {mockGigRequest.client.verified && <CheckCircle className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="mb-1 flex items-center space-x-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                      <span className="font-medium">{mockGigRequest.client.rating}</span>
                      <span>({mockGigRequest.client.reviews} reviews)</span>
                    </div>
                    <p className="text-sm text-gray-500">{mockGigRequest.client.location}</p>
                  </div>
                </div>

                <div className="mb-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Member since:</span>
                    <span className="font-medium">{mockGigRequest.client.memberSince}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total posted:</span>
                    <span className="font-medium">{mockGigRequest.client.totalPosted} gigs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion rate:</span>
                    <span className="font-medium text-green-600">{mockGigRequest.client.completionRate}%</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                  <MessageCircle className="h-4 w-4" />
                  Message Client
                </Button>
              </CardContent>
            </Card>

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
