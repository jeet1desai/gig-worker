import { REVIEW_RATING_STATUS } from '@/enums/be/user';
import prisma from '@/lib/prisma';

export type RatingStats = {
  average_rating: number;
  total_ratings: number;
};

export async function calculateAverageRating(whereClause: object): Promise<RatingStats> {
  const ratings = await prisma.reviewRating.findMany({
    where: {
      ...whereClause,
      status: REVIEW_RATING_STATUS.APPROVED
    },
    select: { rating: true }
  });

  if (ratings.length === 0) {
    return { average_rating: 0, total_ratings: 0 };
  }

  const totalRatings = ratings.length;
  const sumOfRatings = ratings.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = sumOfRatings / totalRatings;

  return { average_rating: averageRating, total_ratings: totalRatings };
}
