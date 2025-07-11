import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: {
      id: string | number;
      email: string;
      role: string;
      first_name: string;
      last_name: string;
      profile_url?: string;
      sign_up_type?: string;
      is_verified: boolean;
      subscription?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    profile_url?: string;
    sign_up_type?: string;
    is_verified: boolean;
    subscription?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    exp: number;
    customAccessToken: string;
  }
}
