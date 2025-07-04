'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import UserDetailPage from './user-details';
import Loader from '@/components/Loader';

import { PRIVATE_ROUTE } from '@/constants/app-routes';

import { getUserDetailsAction } from '@/actions/AdminUserActions';

interface UserProfile {
  bio: string | null;
  skills: string[];
  interests: string[];
  educations: string[];
  certifications: string[];
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

interface APIUserData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  is_verified: boolean;
  is_banned: boolean;
  sign_up_type: string | null;
  created_at: Date;
  updated_at: Date;
  profile_url: string | null;
  profile?: UserProfile;
  subscriptions?: UserSubscription[];
  ban?: {
    reason: string | null;
    expires_at: Date | null;
    strike_count: number;
  };
  _count?: {
    gigs: number;
    provider_bids: number;
    user_received_bids: number;
  };
}

interface APIResponse {
  success: boolean;
  data: APIUserData | null;
  error?: string;
}

const UserDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<Partial<UserDetails>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const response = (await getUserDetailsAction(id as string)) as unknown as APIResponse;

      if (response?.success && response.data) {
        const userData = response.data;

        const userDetails: Partial<UserDetails> = {
          id: 'usr_123456789',
          first_name: 'Alex',
          last_name: 'Johnson',
          email: 'alex.johnson@example.com',
          role: 'freelancer',
          is_verified: true,
          is_banned: false,
          sign_up_type: 'email',
          created_at: new Date('2024-01-15T10:30:00Z'),
          updated_at: new Date('2025-06-28T14:45:00Z'),
          profile_url: '',
          profile: {
            bio: 'Full-stack developer with 5+ years of experience in building scalable web applications. Specialized in React, Node.js, and cloud technologies.',
            skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS', 'Docker'],
            interests: ['Web Development', 'Open Source', 'Machine Learning'],
            educations: ['BSc in Computer Science - Stanford University (2019)'],
            certifications: ['AWS Certified Developer - Associate', 'Google Cloud Professional'],
          },
          subscription: {
            id: 'sub_789456123',
            status: 'active',
            plan: 'premium',
            start_date: new Date('2025-01-01T00:00:00Z'),
            end_date: new Date('2025-12-31T23:59:59Z'),
          },
          user_ban: null,
          _count: {
            gigs: 12,
            provider_bids: 45,
            user_received_bids: 28,
          },
        };

        setUser(userDetails);
      } else {
        toast.error(response?.error || 'User not found');
        router.push(PRIVATE_ROUTE.ADMIN_DASHBOARD_PATH);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details');
      router.push(PRIVATE_ROUTE.ADMIN_DASHBOARD_PATH);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Loader isLoading={isLoading} />

      <UserDetailPage user={user} />
    </>
  );
};

export default UserDetails;
