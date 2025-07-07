'use client';

import React, { useState } from 'react';
import { ArrowLeft, Mail, User as UserIcon, Shield, Calendar, CheckCircle, Award, BookOpen, Ban } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { PRIVATE_ROUTE } from '@/constants/app-routes';
import { formatDate } from '@/lib/date-format';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { UserDetails } from './page';

const UserDetailPage = ({ user }: { user: Partial<UserDetails> }) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');

  const redirectToPreviousPage = () => {
    router.push(PRIVATE_ROUTE.ADMIN_USERS_DASHBOARD_PATH);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="cursor-pointer rounded-xl hover:bg-[#374151]" onClick={redirectToPreviousPage}>
            <ArrowLeft className="h-4 w-4 text-white" />
          </Button>
          <h2 className="text-2xl font-bold text-white">User Details</h2>
        </div>
        <div className="flex space-x-2">
          {user.is_banned ? (
            <Button variant="outline" className="cursor-pointer rounded-xl bg-green-600 !px-4 text-white hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" /> Unban User
            </Button>
          ) : (
            <Button variant="destructive" className="cursor-pointer rounded-xl bg-red-600 !px-4 text-white hover:bg-red-700">
              <Ban className="h-4 w-4" /> Ban User
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-1">
          <Card className="gap-0 border-gray-700 p-0">
            <CardContent className="!p-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-full bg-gray-700">
                  {user.profile_url ? (
                    <Image src={user.profile_url} alt="John Deo" width={80} height={80} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white">John Deo</h3>
                <div className="mt-2 flex flex-wrap justify-center gap-2 text-white">
                  <Badge className={user.is_verified ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-100'}>
                    {user.is_verified ? 'Verified' : 'Unverified'}
                  </Badge>
                  <Badge className={user.is_banned ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-100'}>
                    {user.is_banned ? 'Banned' : 'Active'}
                  </Badge>
                  <Badge className="border-gray-700 text-gray-100 capitalize">{user.role === 'user' ? 'User' : 'Provider'}</Badge>
                </div>
              </div>
            </CardContent>

            <Separator className="bg-gray-700" />

            <CardContent className="!space-y-4 !p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 text-blue-400">
                  <Mail className="size-4" />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-400">Email</p>
                  <p className="mt-0.5 text-sm text-gray-200">{user.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 text-blue-400">
                  <Calendar className="size-4" />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-400">Member Since</p>
                  <p className="mt-0.5 text-sm text-gray-200">{formatDate(user.created_at)}</p>
                </div>
              </div>
              {user.sign_up_type && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-blue-400">
                    <UserIcon className="size-4" />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-400">Sign Up Method</p>
                    <p className="mt-0.5 text-sm text-gray-200">{user.sign_up_type.charAt(0).toUpperCase() + user.sign_up_type.slice(1)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="gap-0 border-gray-700 p-0">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold text-white">Subscription</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {user.subscription ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Plan:</span>
                    <Badge
                      className={
                        user.subscription.status === 'active' ? 'border-gray-700 text-gray-100 capitalize' : 'bg-gray-600 text-gray-100 capitalize'
                      }
                    >
                      {user.subscription.plan}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Status:</span>
                    <Badge
                      className={
                        user.subscription.status === 'active'
                          ? 'border-gray-700 text-gray-100 capitalize'
                          : user.subscription.status === 'expired'
                            ? 'bg-red-600 text-white capitalize'
                            : 'bg-gray-600 text-gray-100 capitalize'
                      }
                    >
                      {user.subscription.status}
                    </Badge>
                  </div>
                  {user.subscription.end_date && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Expires:</span>
                      <span className="text-sm text-gray-400">{formatDate(user.subscription.end_date)}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No active subscription</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-gray-800 p-1">
              <TabsTrigger value="overview" className="text-gray-100 data-[state=active]:text-black">
                Overview
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-gray-100 data-[state=active]:text-black">
                Profile
              </TabsTrigger>
              {/* <TabsTrigger value="activity" className="text-gray-100 data-[state=active]:text-black">
                Activity
              </TabsTrigger> */}
              <TabsTrigger value="settings" className="text-gray-100 data-[state=active]:text-black">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="gap-0 border-gray-700 p-0">
                <CardHeader className="p-6">
                  <CardTitle className="text-lg font-semibold text-gray-100">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 text-blue-400">
                        <UserIcon className="size-4" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-400">First Name</p>
                        <p className="mt-0.5 text-sm text-gray-200">{user.first_name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 text-blue-400">
                        <UserIcon className="size-4" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-400">Last Name</p>
                        <p className="mt-0.5 text-sm text-gray-200">{user.last_name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 text-blue-400">
                        <Mail className="size-4" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-400">Email</p>
                        <p className="mt-0.5 text-sm text-gray-200">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 text-blue-400">
                        <Shield className="size-4" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-400">Account Status</p>
                        <p className="mt-0.5 text-sm text-gray-200">
                          <span className={user.is_banned ? 'text-red-400' : 'text-green-400'}>{user.is_banned ? 'Banned' : 'Active'}</span>
                          {user.is_banned && user.user_ban?.reason && (
                            <span className="mt-1 block text-xs text-gray-400">Reason: {user.user_ban.reason}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gap-0 border-gray-700 p-0">
                <CardHeader className="p-6">
                  <CardTitle className="text-lg font-semibold text-gray-100">Account Statistics</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Gigs</p>
                      <p className="text-2xl font-bold text-white">{2}</p>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Bids</p>
                      <p className="text-2xl font-bold text-white">{1}</p>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Bids Received</p>
                      <p className="text-2xl font-bold text-white">{1}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card className="gap-0 border-gray-700 p-0">
                <CardContent className="space-y-10 p-6">
                  {user?.profile?.skills && user.profile.skills.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-lg font-medium text-white">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.profile.skills.map((skill, index) => (
                          <Badge key={index} className="border-gray-700 text-gray-100">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {user?.profile?.educations && user.profile.educations.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-lg font-medium text-white">Education</h3>
                      <ul className="space-y-2">
                        {user.profile.educations.map((education, index) => (
                          <li key={index} className="flex items-start">
                            <BookOpen className="mt-0.5 mr-2 size-4 flex-shrink-0 text-gray-400" />
                            <span className="text-sm text-gray-300">{education}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {user?.profile?.certifications && user.profile.certifications.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-lg font-medium text-white">Certifications</h3>
                      <ul className="space-y-2">
                        {user.profile.certifications.map((cert, index) => (
                          <li key={index} className="flex items-start">
                            <Award className="mt-0.5 mr-2 size-4 flex-shrink-0 text-yellow-400" />
                            <span className="text-sm text-gray-300">{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* <TabsContent value="activity">
              <SectionCard title="Recent Activity">
                <div className="space-y-6">
                  {[
                    {
                      id: '1',
                      type: 'bid_placed',
                      title: 'Placed a bid',
                      description: 'Bid $500 on project "E-commerce Website Development"',
                      timestamp: new Date('2025-07-03T14:30:00Z'),
                      icon: <FileText className="h-5 w-5 text-blue-400" />,
                    },
                    {
                      id: '2',
                      type: 'gig_created',
                      title: 'Created a new gig',
                      description: 'Created gig "Professional Web Development Services"',
                      timestamp: new Date('2025-07-02T10:15:00Z'),
                      icon: <Award className="h-5 w-5 text-green-400" />,
                    },
                    {
                      id: '3',
                      type: 'profile_updated',
                      title: 'Updated profile',
                      description: 'Updated skills and work experience',
                      timestamp: new Date('2025-07-01T16:45:00Z'),
                      icon: <UserIcon className="h-5 w-5 text-purple-400" />,
                    },
                    {
                      id: '4',
                      type: 'withdrawal',
                      title: 'Withdrawal processed',
                      description: 'Withdrew $1,200 to bank account ending in 4567',
                      timestamp: new Date('2025-06-30T09:20:00Z'),
                      icon: <TrendingUp className="h-5 w-5 text-yellow-400" />,
                    },
                    {
                      id: '5',
                      type: 'review_received',
                      title: 'Received a review',
                      description: 'Received 5-star review for project "Mobile App Development"',
                      timestamp: new Date('2025-06-28T11:10:00Z'),
                      icon: <Star className="h-5 w-5 text-yellow-400" />,
                    },
                  ].map((activity) => (
                    <div key={activity.id} className="flex items-start border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                      <div className="mt-0.5 mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-700">
                        {activity.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-white">{activity.title}</h4>
                          <span className="text-xs text-gray-400">{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </TabsContent> */}

            <TabsContent value="settings">
              <Card className="gap-0 border-gray-700 p-0">
                <form className="space-y-8">
                  <div className="space-y-6">
                    <CardContent className="m-0 p-6">
                      <div>
                        <h3 className="mb-4 text-lg font-medium text-white">Basic Information</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div>
                            <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-300">
                              First Name
                            </label>
                            <Input
                              type="text"
                              id="firstName"
                              defaultValue={user?.first_name || ''}
                              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-300">
                              Last Name
                            </label>
                            <Input
                              type="text"
                              id="lastName"
                              defaultValue={user?.last_name || ''}
                              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-300">
                              Email Address
                            </label>
                            <Input
                              type="email"
                              id="email"
                              disabled
                              defaultValue={user?.email || ''}
                              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <Separator className="m-0 bg-gray-700" />

                    <CardContent className="m-0 p-6">
                      <h3 className="mb-4 text-lg font-medium text-white">Account Status</h3>
                      <div className="flex items-center justify-between rounded-lg bg-gray-800 p-4">
                        <div>
                          <h4 className="font-medium text-white">Account Verification</h4>
                          <p className="text-sm text-gray-400">{user?.is_verified ? 'Your account is verified' : 'Your account is not verified'}</p>
                        </div>
                        <button
                          type="button"
                          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                          {user?.is_verified ? 'Verified' : 'Verify Account'}
                        </button>
                      </div>
                    </CardContent>

                    <Separator className="m-0 bg-gray-700" />

                    <CardContent className="m-0 p-6">
                      <div className="flex justify-end">
                        <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700">
                          Save Changes
                        </button>
                      </div>
                    </CardContent>
                  </div>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
