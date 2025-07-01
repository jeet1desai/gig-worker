import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '@/constants/app-routes';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        if (!user.is_verified) {
          throw new Error('Email not verified');
        }

        return {
          id: String(user.id),
          email: user.email,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          profile_url: user.profile_url || '',
          role: user.role,
          sign_up_type: user.sign_up_type || 'email',
          is_verified: user.is_verified ?? false,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        const [firstName, ...rest] = (profile.name || '').split(' ');
        const lastName = rest.join(' ') || '';

        return {
          id: profile.sub,
          email: profile.email,
          first_name: firstName,
          last_name: lastName,
          profile_url: profile.picture,
          role: 'user',
          is_verified: true,
          sign_up_type: 'google',
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as User).role || 'user';

        // If Google login
        if (account?.provider === 'google' && user.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                first_name: (user as User).first_name,
                last_name: (user as User).last_name,
                profile_url: (user as User).profile_url,
                sign_up_type: 'google',
                is_verified: true,
                role: 'user',
                password: '',
              },
            });
            token.id = String(newUser.id);
            token.role = newUser.role;
          } else {
            token.id = String(existingUser.id);
            token.role = existingUser.role;
          }
        }
        token.iat = Math.floor(Date.now() / 1000);
        token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.expires = new Date(token.exp * 1000).toISOString();
      }
      return session;
    },
  },

  jwt: {
    maxAge: 60 * 60 * 24,
  },
  pages: {
    signIn: PUBLIC_ROUTE.LOGIN,
    error: PUBLIC_ROUTE.LOGIN,
    newUser: PRIVATE_ROUTE.DASHBOARD,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
