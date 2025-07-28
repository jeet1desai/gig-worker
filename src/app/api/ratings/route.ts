import prisma from '@/lib/prisma';
import { ValidationError } from 'yup';
import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { COMMON_ERROR_MESSAGES, GIGS_RATING_MESSAGES, VERIFICATION_CODES } from '@/constants';
import { rateGigPayload } from '@/types/be/auth';
import { rateGigSchema } from '@/schemas/be/auth';
import { calculateAverageRating } from '@/lib/server/ratings';
import { REVIEW_RATING_STATUS } from '@/enums/be/user';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = await rateGigSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true
    }) as rateGigPayload;

    const { gig_id, provider_id, user_id, rating, rating_feedback } = validatedData;

    const gig = await prisma.gig.findUnique({ 
      where: { id: BigInt(gig_id) },
      select: { id: true }
    });
    
    if (!gig) {
      return errorResponse({
        code: VERIFICATION_CODES.GIG_NOT_FOUND,
        message: GIGS_RATING_MESSAGES.GIG_NOT_FOUND,
        statusCode: HttpStatusCode.NOT_FOUND
      });
    }

    const [user, provider] = await Promise.all([
      prisma.user.findUnique({ 
        where: { id: BigInt(user_id) },
        select: { id: true }
      }),
      prisma.user.findUnique({ 
        where: { id: BigInt(provider_id) },
        select: { id: true }
      })
    ]);

    if (!user || !provider) {
      return errorResponse({
        code: VERIFICATION_CODES.USER_NOT_FOUND,
        message: COMMON_ERROR_MESSAGES.USER_NOT_FOUND_MESSAGE,
        statusCode: HttpStatusCode.NOT_FOUND
      });
    }

    const existingRating = await prisma.reviewRating.findFirst({
      where: {
        gig_id: BigInt(gig_id),
        user_id: BigInt(user_id)
      }
    });

    let review;
    
    if (existingRating) {
      review = await prisma.reviewRating.update({
        where: { id: existingRating.id },
        data: {
          rating,
          rating_feedback: rating_feedback || null,
          updated_at: new Date(),
          status: REVIEW_RATING_STATUS.PENDING
        }
      });
    } else {
      review = await prisma.reviewRating.create({
        data: {
          gig_id: BigInt(gig_id),
          provider_id: BigInt(provider_id),
          user_id: BigInt(user_id),
          rating,
          rating_feedback: rating_feedback || null,
          status: REVIEW_RATING_STATUS.PENDING
        }
      });
    }

    const stats = await calculateAverageRating({ provider_id: BigInt(provider_id) });

    return successResponse({
      message: existingRating 
        ? GIGS_RATING_MESSAGES.RATING_UPDATED 
        : GIGS_RATING_MESSAGES.RATING_CREATED,
      data: {
        review,
        average_rating: stats.average_rating,
        total_ratings: stats.total_ratings
      },
      statusCode: HttpStatusCode.OK
    });

  } catch (err) {
    if (err instanceof ValidationError) {
      const fieldErrors = Object.fromEntries(
        err.inner.map((e) => [e.path ?? 'unknown', e.message])
      );
      return errorResponse({
        code: VERIFICATION_CODES.VALIDATION_ERROR,
        message: COMMON_ERROR_MESSAGES.INVALID_REQUEST_PAYLOAD,
        statusCode: HttpStatusCode.BAD_REQUEST,
        fieldErrors
      });
    }

    return errorResponse({
      code: VERIFICATION_CODES.INTERNAL_SERVER_ERROR,
      message: COMMON_ERROR_MESSAGES.SOMETHING_WENT_WRONG_MESSAGE,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return errorResponse({
        code: VERIFICATION_CODES.VALIDATION_ERROR,
        message: COMMON_ERROR_MESSAGES.USER_NOT_FOUND_MESSAGE,
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const ratings = await prisma.reviewRating.findMany({
      where: {
        user_id: BigInt(userId),
        status: REVIEW_RATING_STATUS.APPROVED
      },
      include: {
        gig: true,
        provider: true
      }
    });

    return successResponse({
      message: GIGS_RATING_MESSAGES.RATING_FETCHED,
      data: ratings,
      statusCode: HttpStatusCode.OK
    });
  } catch (err) {
    return errorResponse({
      code: VERIFICATION_CODES.INTERNAL_SERVER_ERROR,
      message: COMMON_ERROR_MESSAGES.SOMETHING_WENT_WRONG_MESSAGE,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
       });
  }
}