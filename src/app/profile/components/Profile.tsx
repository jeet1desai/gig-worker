'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dot, StarIcon, PencilIcon, UserIcon, BriefcaseIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import DashboardLayout from '@/components/layouts/layout';
import EditProfileModal from './EditProfileModal';
import EditProfileTagsModal from './EditProfileTagModal';
import EditEducationModal from './EditEducationModal';
import EditProfilePhotoModal from './EditProfilePhotoModal';
import { BulbSvg, HammerSvg, DartSvg } from '@/components/icons';
import { UserProfile, UserProfileDetails } from '@/types/shared/user';
import { useFilePicker } from '@/hooks/useFilePicker';
import { userService } from '@/services/user.services';
import { toast } from '@/lib/toast';
import StarRatingBadge from '@/components/StarRatingBadge';
import UserGigs from './UserGigs';
import { Button } from '@/components/ui/button';
import { PRIVATE_ROUTE } from '@/constants/app-routes';

interface ProfileProps {
  user: UserProfileDetails;
  isOwnProfile: boolean;
}

export default function Profile({ user, isOwnProfile }: ProfileProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileDetails, setProfilesDetails] = useState(user);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const {
    first_name,
    last_name,
    created_at,
    profile,
    currentPlan,
    totalGigsPosted,
    reviewStats: { avgRating, totalReviews, latestReviews }
  } = profileDetails;

  const { file, error, openFileDialog, clearFiles } = useFilePicker({
    allowedCategories: ['image'],
    maxSizes: { image: 5 },
    multiple: false
  });

  const handleBannerUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploadingBanner(true);
      const response = await userService.updateUserBannerPicture(formData);
      setProfilesDetails((prev) => ({
        ...prev,
        profile: response.data as UserProfile
      }));
      toast.success('Banner image updated successfully');
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update banner');
      }
    } finally {
      setIsUploadingBanner(false);
      clearFiles();
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearFiles();
      return;
    }
    if (file) {
      handleBannerUpload();
    }
  }, [file, error]);

  const fullName = `${first_name} ${last_name}`;
  const skills = profile?.skills || [];
  const extracurricular = profile?.extracurricular || [];
  const interests = profile?.interests || [];
  const educations = profile?.educations || [];

  const handleUpdateProfile = (updateUserDetails: UserProfileDetails) => {
    setProfilesDetails({ ...updateUserDetails });
  };

  const planPageRedirection = () => {
    router.push(PRIVATE_ROUTE.PLANS);
  };

  return (
    <DashboardLayout>
      <main className={`h-full w-full overflow-x-hidden bg-[#111111] font-sans text-white`}>
        <div className="grid h-full grid-cols-1 gap-6 px-4 py-6 md:px-8 lg:grid-cols-4 lg:px-16">
          <div className="rounded-xl bg-gradient-to-br from-[#1f2937] via-[#111827] to-[#0f172a] shadow-lg lg:col-span-1">
            <div className="relative mb-4 h-32 overflow-hidden rounded-lg rounded-b-none shadow-md">
              {profile?.banner_url ? (
                <img alt="Banner" src={profile.banner_url} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-r from-[#6366f1] via-[#ec4899] to-[#0ea5e9]" />
              )}

              {isOwnProfile && (
                <div className="absolute top-2 right-2">
                  {isUploadingBanner ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <PencilIcon className="h-4 w-4 cursor-pointer text-white hover:text-gray-300" onClick={openFileDialog} />
                  )}
                </div>
              )}
            </div>

            <div className="-mt-20 flex flex-col items-center gap-2 px-4">
              <EditProfilePhotoModal user={profileDetails} isOwnProfile={isOwnProfile} handleUpdateProfileAction={handleUpdateProfile} />
              <h1 className="mt-1 text-xl font-semibold">{fullName}</h1>
              <p className="text-xs text-gray-400">Member Since {new Date(created_at).getFullYear()}</p>
              <div className="flex flex-wrap items-center justify-center">
                <p className="text-sm text-gray-400">
                  Plan: <span className="text-sm text-white">{currentPlan.plan.name}</span>
                </p>
                <Dot />
                <button
                  className="inline-block min-w-[52px] cursor-pointer text-sm text-blue-400 transition-all duration-200 hover:font-medium"
                  onClick={planPageRedirection}
                >
                  Change
                </button>
              </div>

              <div className="mt-2 flex gap-4">
                <Button variant="secondary" className="rounded-md bg-gray-700 px-4 py-1 text-sm text-white shadow hover:bg-gray-600">
                  Message
                </Button>
              </div>

              <div className="mt-3 h-[1px] w-full bg-gray-400" />
            </div>

            <div className="mt-6 space-y-2 px-4">
              <button
                className={`text-md flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 text-left font-medium transition ${
                  activeTab === 'profile' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <UserIcon className="h-4 w-4" /> Profile
              </button>
              <button
                className={`text-md flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 text-left font-medium transition ${
                  activeTab === 'opportunities' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('opportunities')}
              >
                <BriefcaseIcon className="h-4 w-4" /> Gigs
              </button>
              <button
                className={`text-md flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 text-left font-medium transition ${
                  activeTab === 'completed' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('completed')}
              >
                <BriefcaseIcon className="h-4 w-4" /> Completed Gigs
              </button>
            </div>

            <Card className="mx-4 mt-6 mb-4 border-none bg-[#1f2937] pt-3.5 pb-4.5">
              <CardContent className="space-y-5 px-5 pt-0">
                <div>
                  <h3 className="text-md mb-3 font-semibold text-white">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {['English', 'Hindi'].map((lang) => (
                      <Badge key={lang} className="bg-gray-700 px-2 py-1 text-sm text-white">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mb-4 grid grid-cols-2 px-4">
              <div className="border-r-none rounded-lg rounded-r-none border border-gray-600 px-6 py-4 text-center">
                <h3 className="text-md mb-1 font-semibold">Jobs Posted</h3>
                <p className="text-lg font-semibold text-yellow-100">{totalGigsPosted}</p>
              </div>
              <div className="border-l-none rounded-lg rounded-l-none border border-gray-600 px-6 py-4 text-center">
                <h3 className="text-md mb-1 font-semibold">Ratings</h3>
                <span className="inline-flex items-center rounded-md bg-green-500 px-2 py-1 text-sm font-semibold text-white">
                  {avgRating} <StarIcon className="ml-1 h-4 w-4 fill-white" />
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card className="h-full bg-[#111]">
                <CardContent className="h-full space-y-6 overflow-y-auto px-6">
                  <div className="rounded-xl bg-black px-4 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="mb-2 text-lg font-semibold text-gray-300">About</h3>
                      <EditProfileModal user={profileDetails} isOwnProfile={isOwnProfile} handleUpdateProfileAction={handleUpdateProfile} />
                    </div>
                    <p className="text-sm text-white">{profile?.bio || 'No bio available'}</p>
                  </div>

                  <div className="space-y-8 rounded-xl bg-black px-4 py-5">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-md flex items-center gap-1.5 font-semibold text-gray-300">
                          <HammerSvg /> Skills
                        </h3>
                        <EditProfileTagsModal user={profileDetails} isOwnProfile={isOwnProfile} handleUpdateProfileAction={handleUpdateProfile} />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {skills.length > 0 ? (
                          skills?.map((item: string, idx: number) => (
                            <span key={idx} className="mt-1 rounded-full bg-[#1b1b1b] px-3 py-1 text-sm text-white">
                              {item}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-white">No skills added</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-md flex items-center gap-1.5 font-semibold text-gray-300">
                          <DartSvg /> Extracurricular
                        </h3>
                      </div>
                      {extracurricular.length > 0 ? (
                        <div className="text-md mt-2 flex flex-wrap gap-4 text-white">
                          {extracurricular.map((item: string, index: number) => (
                            <span key={index} className="mt-1 rounded-full bg-[#1b1b1b] px-3 py-1 text-sm text-white">
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-white no-underline">No extracurricular added</p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-md flex items-center gap-1.5 font-semibold text-gray-300">
                          <BulbSvg /> Interests
                        </h3>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {interests.length > 0 ? (
                          interests?.map((item: string, idx: number) => (
                            <span key={idx} className="mt-1 rounded-full bg-[#1a1a1a] px-3 py-1 text-sm text-white">
                              {item}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-white">No interests added</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-xl bg-black px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <h3 className="text-md font-semibold text-gray-300">Ratings</h3>
                        <StarRatingBadge rating={avgRating} />
                      </div>
                      <span className="text-sm text-gray-400">{totalReviews} Reviews</span>
                    </div>

                    {latestReviews.length > 0 ? (
                      latestReviews.map((reviewDetails: any) => {
                        const { id, rating_feedback, user } = reviewDetails;
                        const reviewUserFullName = `${user.first_name} ${user.last_name}`;
                        return (
                          <div key={id} className="border-t border-gray-800 pt-4">
                            <p className="text-md mb-2 text-gray-300">{rating_feedback || 'No feedback provided.'}</p>
                            <div className="flex items-center gap-2">
                              <img src={user.profile_url} alt={reviewUserFullName} className="h-6 w-6 rounded-full" />
                              <span className="text-xs text-gray-500">{reviewUserFullName}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="my-3 text-sm text-white">No reviews yet</p>
                    )}
                  </div>

                  <div className="space-y-3 rounded-xl bg-black px-4 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-semibold text-gray-300">Education</h3>
                      <EditEducationModal user={profileDetails} isOwnProfile={isOwnProfile} handleUpdateProfileAction={handleUpdateProfile} />
                    </div>
                    {educations.length > 0 ? (
                      educations.map((educationDetails) => {
                        const { title, startYear, endYear } = educationDetails;

                        return (
                          <div key={`${title}-${startYear}`} className="flex justify-between text-sm">
                            <span className="text-white">{title}</span>
                            <span className="text-gray-400">
                              {startYear} - {endYear}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="my-3 text-sm text-white">No education history added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'opportunities' && (
              <Card className="h-[calc(100vh-130px)] bg-[#111]">
                <CardContent className="h-full space-y-6 px-6">
                  <UserGigs userId={profileDetails.id} />
                </CardContent>
              </Card>
            )}

            {activeTab === 'completed' && (
              <Card className="h-[calc(100vh-130px)] bg-[#111]">
                <CardContent className="h-full space-y-6 px-6">
                  <UserGigs userId={profileDetails.id} isCompleted={true} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
