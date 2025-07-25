import { ROLE } from '@prisma/client';

export type UserProfile = {
  id: string;
  user_id: string;
  interests: string[] | null;
  extracurricular: string[] | null;
  certifications: string[] | null;
  skills: string[] | null;
  educations: EducationEntry[] | null;
  badges: string[] | null;
  bio: string | null;
  banner_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProfileDetails = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  profile_url: string | null;
  role: ROLE;
  profile: UserProfile | null;

  provider_rating: {
    user: {
      id: string;
      first_name: string | null;
      last_name: string | null;
      profile_url: string | null;
    };
    created_at: string;
  }[];

  totalGigsPosted: number;

  reviewStats: {
    avgRating: number;
    totalReviews: number;
    latestReviews: {
      user: {
        id: string;
        first_name: string | null;
        last_name: string | null;
        profile_url: string | null;
      };
      created_at: string;
    }[];
  };
};

export type AboutUserPayload = {
  first_name: string;
  last_name: string;
  bio: string;
};

export type UpdateUserTagsPayload = {
  skills?: string[];
  interests?: string[];
  extracurricular?: string[];
};

export type EducationEntry = {
  title: string;
  startYear: string;
  endYear: string;
};

export type UpdateEducationPayload = {
  educations: EducationEntry[];
};
