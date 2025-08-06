import { getServerSession } from 'next-auth';
import { GIG_STATUS, BID_STATUS } from '@prisma/client';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse } from '@/lib/api-response';
import { safeJsonResponse } from '@/utils/apiResponse';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/gigs/pipeline - Get gigs pipeline with status filtering and pagination
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse({ code: 'UNAUTHORIZED', message: 'You must be logged in to view gigs', statusCode: HttpStatusCode.UNAUTHORIZED });
    }

    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status')?.toLowerCase() as GIG_STATUS) || GIG_STATUS.open;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    if (!Object.values(GIG_STATUS).includes(status)) {
      return errorResponse({
        code: 'BAD_REQUEST',
        message: 'Invalid status. Must be one of: ' + Object.values(GIG_STATUS).join(', '),
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const [open, inProgress, completed] = await prisma.$transaction([
      prisma.gig.count({
        where: { user_id: BigInt(session.user.id), pipeline: { status: GIG_STATUS.open }, is_removed: false }
      }),
      prisma.gig.count({
        where: { user_id: BigInt(session.user.id), pipeline: { status: GIG_STATUS.in_progress }, is_removed: false }
      }),
      prisma.gig.count({
        where: { user_id: BigInt(session.user.id), pipeline: { status: GIG_STATUS.completed }, is_removed: false }
      })
    ]);

    const total = await prisma.gig.count({
      where: { user_id: BigInt(session.user.id), pipeline: { status: status as GIG_STATUS }, is_removed: false }
    });

    const gigs = await prisma.gig.findMany({
      where: { user_id: BigInt(session.user.id), pipeline: { status: status as GIG_STATUS }, is_removed: false },
      include: {
        user: {
          select: { id: true, first_name: true, last_name: true, email: true, profile_url: true, is_verified: true, is_banned: true }
        },
        pipeline: { select: { status: true } },
        bids: {
          where: { status: BID_STATUS.accepted },
          include: {
            provider: {
              select: { id: true, first_name: true, last_name: true, email: true, profile_url: true, is_verified: true, is_banned: true }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit
    });

    const transformedGigs = gigs.map((gig) => {
      const { pipeline, bids, ...rest } = gig;
      return {
        ...rest,
        status: pipeline?.status || GIG_STATUS.open,
        acceptedBid: bids || [],
        counts: { open, inProgress, completed }
      };
    });

    const totalPages = Math.ceil(total / limit);

    return safeJsonResponse(
      {
        success: true,
        message: 'Gigs fetched successfully',
        data: { gigs: transformedGigs, pagination: { total, page, limit, totalPages }, counts: { open, inProgress, completed } }
      },
      { status: HttpStatusCode.OK }
    );
  } catch (error) {
    console.error('Error fetching gigs:', error);
    return errorResponse({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch gigs', statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
