'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  User as UserIcon,
  Shield,
  Calendar as CalendarIcon,
  CheckCircle,
  Award,
  BookOpen,
  Ban,
  Fingerprint,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import { toast } from '@/lib/toast';
import { format } from 'date-fns';

import { PRIVATE_ROUTE } from '@/constants/app-routes';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date-format';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

import { UserDetails } from './page';

import { adminService } from '@/services/admin.services';
import { useDispatch } from '@/store/store';

const UserDetailPage = ({ user, setUser }: { user: Partial<UserDetails>; setUser: React.Dispatch<React.SetStateAction<Partial<UserDetails>>> }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('overview');

  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [banExpiresAt, setBanExpiresAt] = useState<Date | undefined>(undefined);

  const redirectToPreviousPage = () => {
    router.push(PRIVATE_ROUTE.ADMIN_USERS_DASHBOARD_PATH);
  };

  const handleVerifyAccount = async (userId: any) => {
    if (!user.is_verified) {
      try {
        const response = await dispatch(adminService.verifyUser({ id: userId }) as any);
        if (response && response.data) {
          toast.success('User verified successfully');
          setUser((prevUser) => ({ ...prevUser, ...response.data }));
        }
      } catch (error: any) {
        console.error('Error verifying user:', error);
      }
    }
  };

  const handleBanUser = async () => {
    setIsBanDialogOpen(true);
  };

  const handleBanSubmit = async (values: any) => {};

  const handleUpdateUser = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
    setSubmitting(true);
    try {
      const response = await dispatch(
        adminService.updateAdminUser({
          id: user.id?.toString() || '',
          body: {
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email
          }
        }) as any
      );
      if (response && response.data) {
        setSubmitting(false);
        toast.success('User updated successfully');
        setUser((prevUser) => ({ ...prevUser, ...response.data }));
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const user_status = user.is_banned ? 'Banned' : user.is_deleted ? 'Deactivated' : 'Active';

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
            <Button onClick={handleBanUser} variant="destructive" className="cursor-pointer rounded-xl bg-red-600 !px-4 text-white hover:bg-red-700">
              <Ban className="h-4 w-4" /> Ban User
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Card className="gap-0 border-gray-700/50 bg-inherit p-0">
            <div className="relative">
              <div className="h-32 w-full rounded-tl-lg rounded-tr-lg bg-gradient-to-r from-purple-600 to-blue-500">
                {user.profile?.banner_url && (
                  <Image
                    src={user.profile.banner_url}
                    alt="Banner"
                    width={400}
                    height={128}
                    className="h-full w-full rounded-tl-lg rounded-tr-lg object-cover"
                  />
                )}
              </div>

              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 transform">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-gray-800 bg-gray-700">
                  {user.profile_url ? (
                    <Image
                      src={user.profile_url}
                      alt={`${user.first_name} ${user.last_name}`}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserIcon className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <CardContent className="!pt-14 !pb-6">
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold text-white">
                  {user.first_name} {user.last_name}
                </h3>
                <div className="mt-2 flex flex-wrap justify-center gap-2 text-white">
                  <Badge className={user.is_verified ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-100'}>
                    {user.is_verified ? 'Verified' : 'Unverified'}
                  </Badge>
                  <Badge className={user.is_banned ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-100'}>{user_status}</Badge>
                  <Badge className="border-gray-700 text-gray-600 capitalize">{user.role === 'user' ? 'User' : 'Provider'}</Badge>
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
                  <CalendarIcon className="size-4" />
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

          <Card className="gap-0 border-gray-700/50 bg-inherit p-0">
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

        <div className="space-y-6 lg:col-span-2">
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
              <Card className="gap-0 border-gray-700/50 bg-inherit p-0">
                <CardHeader className="p-6">
                  <CardTitle className="text-lg font-semibold text-gray-100">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6 pt-0">
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
                          <span className={user.is_banned || user.is_deleted ? 'text-red-400' : 'text-green-400'}>{user_status}</span>
                          {user.is_banned && user.user_ban?.reason && (
                            <span className="mt-1 block text-xs text-gray-400">Reason: {user.user_ban.reason}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 text-blue-400">
                      <Fingerprint className="size-4" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-400">Bio</p>
                      <p className="mt-0.5 text-sm text-gray-200">{user.profile?.bio || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gap-0 border-gray-700/50 bg-inherit p-0">
                <CardHeader className="p-6">
                  <CardTitle className="text-lg font-semibold text-gray-100">Account Statistics</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Gigs</p>
                      <p className="text-2xl font-bold text-white">N/A</p>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Bids</p>
                      <p className="text-2xl font-bold text-white">N/A</p>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Bids Received</p>
                      <p className="text-2xl font-bold text-white">N/A</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card className="gap-0 border-gray-700/50 bg-inherit p-0">
                <CardContent className="space-y-10 p-6">
                  <div>
                    <h3 className="mb-2 text-lg font-medium text-white">Skills</h3>
                    {user?.profile?.skills && user.profile.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.profile.skills.map((skill, index) => (
                          <Badge key={index} className="border-gray-700 text-gray-100">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">N/A</p>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-medium text-white">Education</h3>
                    {user?.profile?.educations && user.profile.educations.length > 0 ? (
                      <ul className="space-y-2">
                        {user.profile.educations.map((education, index) => (
                          <li key={index} className="flex items-start">
                            <BookOpen className="mt-0.5 mr-2 size-4 flex-shrink-0 text-gray-400" />
                            <span className="text-sm text-gray-300">{education}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">N/A</p>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-medium text-white">Certifications</h3>
                    {user?.profile?.certifications && user.profile.certifications.length > 0 ? (
                      <ul className="space-y-2">
                        {user.profile.certifications.map((cert, index) => (
                          <li key={index} className="flex items-start">
                            <Award className="mt-0.5 mr-2 size-4 flex-shrink-0 text-yellow-400" />
                            <span className="text-sm text-gray-300">{cert}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">N/A</p>
                    )}
                  </div>
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
              <Card className="gap-0 border-gray-700/50 bg-inherit p-0">
                <div className="space-y-6">
                  <CardContent className="m-0 p-6">
                    <Formik
                      initialValues={{
                        firstName: user?.first_name || '',
                        lastName: user?.last_name || '',
                        email: user?.email || ''
                      }}
                      enableReinitialize
                      validationSchema={Yup.object().shape({
                        firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
                        lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
                        email: Yup.string().email('Invalid email').required('Required')
                      })}
                      onSubmit={handleUpdateUser}
                    >
                      {({ isSubmitting, values, getFieldProps, errors, touched, handleSubmit }) => (
                        <Form className="space-y-8" onSubmit={handleSubmit}>
                          <div className="space-y-4">
                            <h3 className="mb-4 text-lg font-medium text-white">Basic Information</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-gray-300">
                                  First Name
                                </Label>
                                <Input
                                  type="text"
                                  id="firstName"
                                  defaultValue={values.firstName}
                                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                  {...getFieldProps('firstName')}
                                />
                                {errors.firstName && touched.firstName && <div className="text-sm text-red-500">{errors.firstName}</div>}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-gray-300">
                                  Last Name
                                </Label>
                                <Input
                                  type="text"
                                  id="lastName"
                                  defaultValue={values.lastName}
                                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                  {...getFieldProps('lastName')}
                                />
                                {errors.lastName && touched.lastName && <div className="text-sm text-red-500">{errors.lastName}</div>}
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="email" className="text-gray-300">
                                  Email Address
                                </Label>
                                <Input
                                  type="email"
                                  id="email"
                                  disabled
                                  defaultValue={values.email}
                                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                  {...getFieldProps('email')}
                                />
                                {errors.email && touched.email && <div className="text-sm text-red-500">{errors.email}</div>}
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="cursor-pointer rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                              >
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
                              </button>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </CardContent>

                  <Separator className="m-0 bg-gray-700" />

                  <CardContent className="m-0 p-6">
                    <div className="flex items-center justify-between rounded-lg bg-gray-800 p-4">
                      <div>
                        <h4 className="font-medium text-white">Account Verification</h4>
                        <p className="text-sm text-gray-400">{user?.is_verified ? 'Your account is verified' : 'Your account is not verified'}</p>
                      </div>
                      <button
                        type="button"
                        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        onClick={() => handleVerifyAccount(user?.id)}
                      >
                        {user?.is_verified ? <CheckCircle className="h-4 w-4" /> : 'Verify Account'}
                      </button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <DialogContent className="border-gray-700 bg-gray-800 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-white">Ban User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to ban this user? Please provide a reason and expiration date.
            </DialogDescription>
          </DialogHeader>

          <Formik
            initialValues={{
              banReason: '',
              banExpiresAt: ''
            }}
            validationSchema={Yup.object().shape({
              banReason: Yup.string().required('Required'),
              banExpiresAt: Yup.date().required('Required')
            })}
            onSubmit={handleBanSubmit}
          >
            {({ isSubmitting, values, getFieldProps, errors, touched, handleSubmit }) => (
              <Form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Ban Expiration</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start border-gray-600 bg-gray-700 text-left font-normal !text-gray-300 hover:bg-gray-700',
                            !banExpiresAt && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {banExpiresAt ? format(banExpiresAt, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto border-gray-700 bg-gray-800 p-0">
                        <Calendar
                          mode="single"
                          selected={banExpiresAt}
                          onSelect={setBanExpiresAt}
                          className="bg-gray-800 text-white"
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-gray-400">The ban will be automatically lifted on the selected date.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banReason" className="text-gray-300">
                      Reason for Ban
                    </Label>
                    <Textarea
                      id="banReason"
                      className="min-h-[100px] border-gray-600 bg-gray-700 text-white"
                      placeholder="Enter the reason for banning this user..."
                    />
                  </div>
                </div>

                <DialogFooter className="sm:justify-end">
                  <Button type="button" variant="destructive" onClick={handleBanSubmit} className="bg-red-600 text-white hover:bg-red-700">
                    {false ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm Ban'}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDetailPage;
