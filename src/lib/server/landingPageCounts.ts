import { safeJson } from '@/lib/utils/safeJson';
import prisma from '@/lib/prisma';

export const getAllFreelancersNumber = async () => {
  const count = await prisma.user.count({
    where: { is_deleted: false }
  });

  return safeJson(count);
};

export const getAllPositiveReviewsNumber = async () => {
  const count = await prisma.reviewRating.count();

  return safeJson(count);
};

export const getAllCreatedGigsNumber = async () => {
  const count = await prisma.gig.count();

  return safeJson(count);
};

export const getAllCompletedGigsNumber = async () => {
  const count = await prisma.gigPipeline.count({
    where: {
      status: 'completed'
    }
  });

  return safeJson(count);
};

export const getAverageRating = async () => {
  const result = await prisma.reviewRating.aggregate({
    _avg: {
      rating: true
    }
  });

  return safeJson(result._avg.rating || 0);
};
