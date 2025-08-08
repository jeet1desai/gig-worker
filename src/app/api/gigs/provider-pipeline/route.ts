import { getServerSession } from 'next-auth';
import { BID_STATUS, GIG_STATUS } from '@prisma/client';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse } from '@/lib/api-response';
import { safeJsonResponse } from '@/utils/apiResponse';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import moment from 'moment';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse({ code: 'UNAUTHORIZED', message: 'You must be logged in to view bids', statusCode: HttpStatusCode.UNAUTHORIZED });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status')?.toLowerCase() || BID_STATUS.pending;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const validStatuses = [BID_STATUS.pending, BID_STATUS.accepted, BID_STATUS.rejected];
    if (!validStatuses.includes(status as BID_STATUS)) {
      return errorResponse({
        code: 'BAD_REQUEST',
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const statusMap = {
      pending: BID_STATUS.pending,
      accepted: BID_STATUS.accepted,
      rejected: BID_STATUS.rejected
    };

    const dbStatus = statusMap[status as keyof typeof statusMap];

    const [pending, accepted, rejected] = await prisma.$transaction([
      prisma.bid.count({
        where: {
          provider_id: BigInt(session.user.id),
          status: BID_STATUS.pending
        }
      }),
      prisma.bid.count({
        where: {
          provider_id: BigInt(session.user.id),
          status: BID_STATUS.accepted
        }
      }),
      prisma.bid.count({
        where: {
          provider_id: BigInt(session.user.id),
          status: BID_STATUS.rejected
        }
      })
    ]);

    const total = await prisma.bid.count({
      where: {
        provider_id: BigInt(session.user.id),
        status: dbStatus
      }
    });

    const bids = await prisma.bid.findMany({
      where: {
        provider_id: BigInt(session.user.id),
        status: dbStatus
      },
      include: {
        gig: {
          include: {
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                profile_url: true,
                is_verified: true
              }
            },
            pipeline: {
              select: { status: true }
            },
            payment: {
              select: {
                status: true
              }
            },
            review_rating: true
          }
        }
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit
    });

    const transformedBids = bids.map((bid) => {
      const { gig, ...rest } = bid;
      const gigUser = gig.user;
      const endDate = gig.end_date ? moment(gig.end_date) : null;
      const today = moment();

      const daysLeft = endDate ? endDate.diff(today, 'days') : null;

      return {
        ...rest,
        gig,
        title: gig.title,
        client: `${gigUser.first_name} ${gigUser.last_name}`,
        clientProfile: gigUser,
        gigStatus: gig.pipeline?.status || GIG_STATUS.open,
        daysLeft
      };
    });

    const totalPages = Math.ceil(total / limit);

    return safeJsonResponse(
      {
        success: true,
        message: 'Provider bids fetched successfully',
        data: {
          bids: transformedBids,
          pagination: { total, page, limit, totalPages },
          counts: { pending, accepted, rejected }
        }
      },
      { status: HttpStatusCode.OK }
    );
  } catch (error) {
    console.error('Error fetching provider bids:', error);
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch provider bids',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
