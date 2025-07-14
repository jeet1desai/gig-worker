import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '@/constants/app-routes';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            subscriptions: {
              where: {
                status: 'active'
              },
              take: 1,
              select: {
                type: true
              }
            }
          }
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
          subscription: user.subscriptions?.[0]?.type || null
        };
      }
    }),
    CredentialsProvider({
      id: 'admin-credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email }
        });

        if (!admin) {
          throw new Error('Admin not found.');
        }

        const valid = await bcrypt.compare(credentials.password, admin.password);
        if (!valid) {
          throw new Error('Invalid credentials.');
        }

        return {
          id: String(admin.id),
          email: admin.email,
          name: `${admin.first_name} ${admin.last_name}`,
          first_name: admin.first_name || '',
          last_name: admin.last_name || '',
          image: admin.profile_url || '',
          is_verified: true,
          role: 'admin'
        };
      }
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
          sign_up_type: 'google'
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role || 'user';
        token.first_name = user.first_name || '';
        token.last_name = user.last_name || '';
        token.subscription = user.subscription || null;

        const payload = {
          id: user.id,
          email: user.email,
          role: user.role || 'user'
        };

        token.customAccessToken = jwt.sign(payload, process.env.NEXTAUTH_SECRET!, {
          expiresIn: '1d'
        });

        // If Google login
        if (account?.provider === 'google' && user.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: {
              subscriptions: {
                where: {
                  status: 'active'
                },
                take: 1,
                select: {
                  type: true
                }
              }
            }
          });
          if (!existingUser) {
            const newUser: any = await prisma.user.create({
              data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_url: user.profile_url,
                sign_up_type: 'google',
                is_verified: true,
                role: 'user',
                password: ''
              }
            });

            token.id = String(newUser.id);
            token.email = newUser.email;
            token.role = newUser.role;
            token.first_name = newUser.first_name || '';
            token.last_name = newUser.last_name || '';
            token.subscription = null;
          } else {
            token.id = String(existingUser.id);
            token.email = user.email;
            token.role = existingUser.role;
            token.first_name = existingUser.first_name || '';
            token.last_name = existingUser.last_name || '';
            token.subscription = existingUser.subscriptions?.[0]?.type || null;
          }
        }
        token.iat = Math.floor(Date.now() / 1000);
        token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
      }

      if (trigger === 'update' && session?.subscription) {
        token.subscription = session.subscription;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.first_name + ' ' + token.last_name;
        session.user.role = token.role;
        session.accessToken = token.customAccessToken;
        session.user.subscription = token.subscription || null;
        session.expires = new Date(token.exp * 1000).toISOString();
      }
      return session;
    }
  },

  jwt: {
    maxAge: 60 * 60 * 24
  },
  pages: {
    signIn: PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH,
    error: PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH,
    newUser: PRIVATE_ROUTE.DASHBOARD
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
