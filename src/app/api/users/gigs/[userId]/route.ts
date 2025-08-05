import { NextRequest } from 'next/server';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse, successResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { safeJson } from '@/lib/utils/safeJson';
import { BID_STATUS, GIG_STATUS } from '@prisma/client';

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  if (!userId) {
    return errorResponse({
      code: 'USER_ID_MISSING',
      message: 'User ID is required',
      statusCode: HttpStatusCode.BAD_REQUEST
    });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 10);
    const gigStatus = searchParams.get('gigStatus') || '';
    const gigCompleted = searchParams.get('gigCompleted') || false;
    const skip = (page - 1) * limit;
    let gigs;

    const whereCondition: any = {
      user_id: BigInt(userId),
      is_removed: false
    };

    if (gigStatus !== '') {
      whereCondition.pipeline = {
        status: gigStatus as GIG_STATUS
      };
    }

    if (gigCompleted) {
      gigs = await prisma.gig.findMany({
        where: {
          is_removed: false,
          pipeline: {
            status: GIG_STATUS.completed
          },
          bids: {
            some: {
              provider_id: BigInt(userId),
              status: BID_STATUS.accepted
            }
          }
        },
        include: {
          _count: {
            select: { bids: true }
          },
          bids: {
            where: {
              provider_id: BigInt(userId),
              status: BID_STATUS.accepted
            },
            select: { bid_price: true }
          },
          pipeline: true,
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              profile_url: true
            }
          }
        }
      });
    } else {
      gigs = await prisma.gig.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          _count: {
            select: { bids: true }
          },
          bids: {
            select: { bid_price: true }
          },
          pipeline: {
            select: { status: true }
          }
        }
      });
    }

    const total = await prisma.gig.count({
      where: { user_id: BigInt(userId) }
    });

    return successResponse({
      data: {
        gigs: safeJson(gigs),
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      },
      message: 'Gigs fetched successfully',
      statusCode: HttpStatusCode.OK
    });
  } catch (err) {
    return errorResponse({
      code: 'INTERNAL_ERROR',
      message: 'Failed to fetch gigs',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}
