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
      return errorResponse({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to view gigs',
        statusCode: HttpStatusCode.UNAUTHORIZED
      });
    }

    const userId = BigInt(session.user.id);
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status')?.toLowerCase() as GIG_STATUS) || GIG_STATUS.open;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    if (!Object.values(GIG_STATUS).includes(status)) {
      return errorResponse({
        code: 'BAD_REQUEST',
        message: 'Invalid status. Must be one of: ' + Object.values(GIG_STATUS).join(', '),
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const [open, inProgress, completed, total] = await prisma.$transaction([
      prisma.gig.count({ where: { user_id: userId, pipeline: { status: GIG_STATUS.open }, is_removed: false } }),
      prisma.gig.count({ where: { user_id: userId, pipeline: { status: GIG_STATUS.in_progress }, is_removed: false } }),
      prisma.gig.count({ where: { user_id: userId, pipeline: { status: GIG_STATUS.completed }, is_removed: false } }),
      prisma.gig.count({ where: { user_id: userId, pipeline: { status }, is_removed: false } })
    ]);

    const gigs = await prisma.gig.findMany({
      where: {
        user_id: userId,
        pipeline: { status },
        is_removed: false
      },
      include: {
        user: {
          select: { id: true, first_name: true, last_name: true, email: true, profile_url: true, is_verified: true, is_banned: true }
        },
        pipeline: { select: { status: true } },
        bids: {
          where: { status: BID_STATUS.accepted },
          select: {
            id: true,
            provider_id: true,
            provider: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                profile_url: true,
                is_verified: true,
                is_banned: true,
                username: true
              }
            }
          }
        },
        payment: true,
        review_rating: true
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit
    });

    const providerIds = [...new Set(gigs.flatMap((gig) => gig.bids.map((b) => b.provider_id).filter(Boolean)))];

    let providerStatsMap: Record<number, { avgRating: number; totalCompletedGigs: number }> = {};

    if (providerIds.length > 0) {
      const avgRatings = await prisma.reviewRating.groupBy({
        by: ['provider_id'],
        where: { provider_id: { in: providerIds } },
        _avg: { rating: true }
      });

      const completedCounts = await prisma.bid.groupBy({
        by: ['provider_id'],
        where: {
          status: BID_STATUS.accepted,
          gig: {
            pipeline: { status: GIG_STATUS.completed }
          }
        },
        _count: { provider_id: true }
      });

      avgRatings.forEach((rating) => {
        providerStatsMap[Number(rating.provider_id)] = {
          avgRating: rating._avg.rating || 0,
          totalCompletedGigs: 0
        };
      });

      completedCounts.forEach((count) => {
        const id = Number(count.provider_id);
        if (!providerStatsMap[id]) {
          providerStatsMap[id] = { avgRating: 0, totalCompletedGigs: 0 };
        }
        providerStatsMap[id].totalCompletedGigs = count._count.provider_id;
      });
    }

    const transformedGigs = gigs.map((gig) => ({
      ...gig,
      status: gig.pipeline?.status || GIG_STATUS.open,
      acceptedBid: gig.bids || [],
      providerStats: gig.bids[0]?.provider_id
        ? providerStatsMap[Number(gig.bids[0].provider_id)] || { avgRating: 0, totalCompletedGigs: 0 }
        : { avgRating: 0, totalCompletedGigs: 0 },
      counts: { open, inProgress, completed }
    }));

    const totalPages = Math.ceil(total / limit);

    return safeJsonResponse(
      {
        success: true,
        message: 'Gigs fetched successfully',
        data: {
          gigs: transformedGigs,
          pagination: { total, page, limit, totalPages },
          counts: { open, inProgress, completed }
        }
      },
      { status: HttpStatusCode.OK }
    );
  } catch (error) {
    console.error('Error fetching gigs:', error);
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch gigs',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
