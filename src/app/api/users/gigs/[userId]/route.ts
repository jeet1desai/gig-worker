import { NextRequest } from 'next/server';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse, successResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { safeJson } from '@/lib/utils/safeJson';

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
    const skip = (page - 1) * limit;

    const gigs = await prisma.gig.findMany({
      where: { user_id: BigInt(userId), is_removed: false },
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
