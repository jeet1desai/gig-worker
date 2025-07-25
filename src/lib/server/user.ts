import prisma from '@/lib/prisma';
import { safeJson } from '../utils/safeJson';

export async function getUserDetails(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
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

  const reviewStats = await prisma.reviewRating.aggregate({
    where: { provider_id: userId },
    _avg: { rating: true },
    _count: { rating: true }
  });

  const totalGigs = await prisma.gig.count({
    where: { user_id: userId }
  });

  return safeJson({
    ...user,
    totalGigsPosted: totalGigs,
    reviewStats: {
      avgRating: reviewStats._avg.rating ?? 0,
      totalReviews: reviewStats._count.rating ?? 0,
      latestReviews: user?.provider_rating ?? []
    }
  });
}
