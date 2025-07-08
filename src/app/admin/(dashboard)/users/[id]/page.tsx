'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import UserDetailPage from './user-details';
import Loader from '@/components/Loader';

import { adminService } from '@/services/admin.services';
import { RootState, useDispatch, useSelector } from '@/store/store';

interface UserProfile {
  bio: string | null;
  skills: string[];
  interests: string[];
  educations: string[];
  certifications: string[];
  banner_url: string | null;
}

interface UserSubscription {
  id: string;
  status: string;
  plan: string;
  start_date: Date;
  end_date: Date | null;
}

interface UserBan {
  reason: string | null;
  ban_expires_at: Date | null;
  strike_count: number;
}

interface UserCounts {
  gigs: number;
  provider_bids: number;
  user_received_bids: number;
}

export interface UserDetails {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  profile_url: string | null;
  role: string;
  is_verified: boolean;
  is_banned: boolean;
  sign_up_type: string | null;
  created_at: Date;
  updated_at: Date;
  profile?: UserProfile;
  subscription: UserSubscription | null;
  user_ban: UserBan | null;
  _count: UserCounts;
}

const UserDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.adminUser);

  const [user, setUser] = useState<Partial<UserDetails>>({});

  useEffect(() => {
    if (id) {
      fetchUserDetails(id as string);
    }
  }, [id]);

  const fetchUserDetails = async (id: string) => {
    try {
      const response: any = await dispatch(adminService.getUserDetails({ id: id }));
      if (response && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <>
      <Loader isLoading={loading} />

      <UserDetailPage user={user} />
    </>
  );
};

export default UserDetails;
