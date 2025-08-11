import prisma from '@/lib/prisma';
import { safeJson } from '../utils/safeJson';
import { SUBSCRIPTION_STATUS } from '@prisma/client';

export async function getUserDetails(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username,
      is_deleted: false,
      is_verified: true,
      is_banned: false
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      created_at: true,
      profile: true,
      profile_url: true,
      role: true,
      provider_rating: {
        orderBy: { created_at: 'desc' },
        take: 2,
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              profile_url: true
            }
          }
        }
      }
    }
  });

  if (!user) return null;

  const currentPlan = await prisma.subscription.findFirst({
    where: {
      user_id: user.id,
      status: SUBSCRIPTION_STATUS.active
    },
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      status: true,
      plan: {
        select: {
          name: true
        }
      }
    }
  });

  const reviewStats = await prisma.reviewRating.aggregate({
    where: { provider_id: user.id },
    _avg: { rating: true },
    _count: { rating: true }
  });

  const totalGigs = await prisma.gig.count({
    where: { user_id: user.id }
  });

  return safeJson({
    ...user,
    totalGigsPosted: totalGigs,
    reviewStats: {
      avgRating: reviewStats._avg.rating ?? 0,
      totalReviews: reviewStats._count.rating ?? 0,
      latestReviews: user?.provider_rating ?? []
    },
    currentPlan
  });
}
