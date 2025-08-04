import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';

import Profile from '../components/Profile';
import { getUserDetails } from '@/lib/server/user';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PUBLIC_ROUTE } from '@/constants/app-routes';
import { UserProfileDetails } from '@/types/shared/user';

export default async function UserProfilePage({ params }: { params: Promise<{ username?: string }> }) {
  const session = await getServerSession(authOptions);
  const loggedInUserId = session?.user?.id;

  const userNameFromUrl = (await params)?.username;

  if (!userNameFromUrl) return redirect(PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH);

  const user = await getUserDetails(userNameFromUrl);
  if (!user) return notFound();

  const isOwnProfile = user.id === loggedInUserId;
  return <Profile user={user as UserProfileDetails} isOwnProfile={isOwnProfile} />;
}
