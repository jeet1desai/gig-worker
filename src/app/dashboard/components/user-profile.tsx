'use client';

import { getInitials } from '@/app/profile/components/EditProfilePhotoModal';
import { Button } from '@/components/ui/button';
import { UserProfileDetails } from '@/types/shared/user';
import Image from 'next/image';
import { Link } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PRIVATE_ROUTE } from '@/constants/app-routes';

type UserProfileProps = {
  user: UserProfileDetails;
  scubscriptionType?: string;
};

export function UserProfile({ user, scubscriptionType }: UserProfileProps) {
  const initials = getInitials(user.first_name!, user.last_name!);
  const isImageAvailable = !!user.profile_url;
  const router = useRouter();
  return (
    <div className="h-full rounded-2xl border border-slate-700/50 p-6 shadow-none backdrop-blur-xl">
      <div className="mb-4 flex items-center space-x-4">
        {isImageAvailable ? (
          <div className="h-12 w-12 overflow-hidden rounded-full shadow ring-2 ring-blue-500/20">
            <Image src={user.profile_url || '/images/avatar.jpg'} alt="Profile" width={48} height={48} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-2xl font-semibold text-black shadow ring-2 ring-blue-500/20">
            {initials}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-white">{`${user.first_name} ${user.last_name}`}</h3>
          <p className="text-sm text-slate-400 capitalize">{scubscriptionType} Account</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-400">Overall Rating</span>
            <span className="text-md font-semibold text-[#1cbae0]">4.8/5</span>
          </div>
          <div className="h-1 w-full rounded-full bg-slate-700">
            <div className="h-1 rounded-full bg-[#1cbae0]" style={{ width: '96%' }}></div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-400">Completion Rate</span>
            <span className="text-md font-semibold text-[#1cbae0]">98%</span>
          </div>
          <div className="h-1 w-full rounded-full bg-slate-700">
            <div className="h-1 rounded-full bg-[#1cbae0]" style={{ width: '98%' }}></div>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="bg-foreground hover:bg-background/10 text-background mt-8 w-full cursor-pointer border-slate-700/50"
        onClick={() => router.push(`${PRIVATE_ROUTE.USER_PROFILE}/${user.id}`)}
      >
        <Link className="h-4 w-4" />
        View Public Profile
      </Button>
    </div>
  );
}
