import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';

import Profile from './components/Profile';
import { getUserDetails } from '@/lib/server/user';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PUBLIC_ROUTE } from '@/constants/app-routes';
import { UserProfileDetails } from '@/types/shared/user';

export default async function UserProfilePage() {
  const session = await getServerSession(authOptions);
  const loggedInUserName = session?.user?.username;

  if (!loggedInUserName) return redirect(PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH);

  const user = await getUserDetails(loggedInUserName);
  if (!user) return notFound();

  return <Profile user={user as UserProfileDetails} isOwnProfile={true} />;
}
