import { getServerSession } from 'next-auth';
import { z } from 'zod';

import prisma from '@/lib/prisma';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { ROLE, BID_STATUS, NOTIFICATION_TYPE, GIG_STATUS } from '@prisma/client';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse } from '@/lib/api-response';
import { safeJsonResponse } from '@/utils/apiResponse';
import { sendNotification } from '@/lib/socket/socket-server';
import { getSocketServer } from '@/app/api/socket/route';

const io = getSocketServer();

const bidSchema = z.object({
  proposal: z.string().min(10, 'Proposal must be at least 10 characters'),
  bidPrice: z.number().positive('Bid price must be a positive number')
});

// GET /api/gigs/bids/[id] - Fetch paginated bids for a specific gig
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse({ code: 'UNAUTHORIZED', message: 'You must be logged in to place a bid', statusCode: HttpStatusCode.UNAUTHORIZED });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const skip = (page - 1) * limit;

    const gigId = await params.id;

    const gig = await prisma.gig.findUnique({
      where: { slug: gigId },
      select: { id: true, user_id: true }
    });
    if (!gig) {
      return errorResponse({ code: 'NOT_FOUND', message: 'Gig not found', statusCode: HttpStatusCode.NOT_FOUND });
    }

    if (gig.user_id !== BigInt(session.user.id)) {
      return safeJsonResponse({
        success: true,
        message: 'Bids fetched successfully',
        data: { items: [], pagination: { total: 0, page: 1, limit, totalPages: 0 } }
      });
    }

    const total = await prisma.bid.count({
      where: { gig_id: gig.id, status: BID_STATUS.pending }
    });

    const bids = await prisma.bid.findMany({
      where: { gig_id: gig.id, status: BID_STATUS.pending },
      include: {
        provider: {
          select: { id: true, first_name: true, last_name: true, email: true, profile_url: true, created_at: true, is_verified: true }
        },
        gig: {
          select: { id: true, title: true, price_range: true }
        }
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit
    });

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);

    return safeJsonResponse({
      success: true,
      message: 'Bids fetched successfully',
      data: {
        items: bids,
        pagination: { total, page: currentPage, limit, totalPages }
      }
    });
  } catch (error) {
    console.error('Error fetching gig:', error);
    return errorResponse({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch gig', statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}

// PATCH /api/gigs/bids/[id] - Accept or reject a bid
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse({ code: 'UNAUTHORIZED', message: 'You must be logged in to update a bid', statusCode: HttpStatusCode.UNAUTHORIZED });
    }

    const bidId = await Number(params.id);
    if (isNaN(bidId)) {
      return errorResponse({ code: 'INVALID_INPUT', message: 'Invalid bid ID', statusCode: HttpStatusCode.BAD_REQUEST });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || (status !== 'accept' && status !== 'reject')) {
      return errorResponse({
        code: 'INVALID_ACTION',
        message: 'Invalid action. Must be either "accept" or "reject"',
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const bid = await prisma.bid.findUnique({
      where: { id: BigInt(bidId) },
      include: {
        gig: { select: { user_id: true, title: true } },
        provider: { select: { id: true, first_name: true, last_name: true, email: true } }
      }
    });
    if (!bid) {
      return errorResponse({ code: 'BID_NOT_FOUND', message: 'Bid not found', statusCode: HttpStatusCode.NOT_FOUND });
    }
    if (bid.gig.user_id !== BigInt(session.user.id)) {
      return errorResponse({ code: 'FORBIDDEN', message: 'Only the gig owner can accept or reject bids', statusCode: HttpStatusCode.FORBIDDEN });
    }
    if (bid.status !== BID_STATUS.pending) {
      return errorResponse({
        code: 'BID_ALREADY_PROCESSED',
        message: `This bid has already been ${bid.status}`,
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const newStatus = status === 'accept' ? BID_STATUS.accepted : BID_STATUS.rejected;

    const [updatedBid] = await prisma.$transaction([
      prisma.bid.update({
        where: { id: bidId },
        data: { status: newStatus },
        include: {
          gig: {
            select: { id: true, title: true, pipeline: true }
          }
        }
      }),
      ...(status === 'accept'
        ? [
            prisma.gigPipeline.upsert({
              where: { gig_id: bid.gig_id },
              update: { status: GIG_STATUS.in_progress },
              create: { gig_id: bid.gig_id, status: GIG_STATUS.in_progress }
            })
          ]
        : [])
    ]);

    const notificationMessage =
      status === 'accept' ? `Your bid for "${bid.gig.title}" has been accepted!` : `Your bid for "${bid.gig.title}" has been rejected.`;

    await sendNotification(io, bid.provider_id.toString(), {
      title: 'New Bid Received',
      message: notificationMessage,
      module: 'gigs',
      type: NOTIFICATION_TYPE.info
    });

    return safeJsonResponse(
      { success: true, message: notificationMessage, data: { bid: updatedBid, message: notificationMessage } },
      { status: HttpStatusCode.OK }
    );
  } catch (error) {
    console.error('Error updating bid status:', error);
    return errorResponse({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update bid status', statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}

// POST /api/gigs/bids/[id] - Place a bid on a gig
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse({ code: 'UNAUTHORIZED', message: 'You must be logged in to place a bid', statusCode: HttpStatusCode.UNAUTHORIZED });
    }

    const gigId = Number(params.id);
    if (isNaN(gigId)) {
      return errorResponse({ code: 'INVALID_INPUT', message: 'Invalid gig ID', statusCode: HttpStatusCode.BAD_REQUEST });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, is_banned: true }
    });
    if (!user) {
      return errorResponse({ code: 'USER_NOT_FOUND', message: 'User not found', statusCode: HttpStatusCode.NOT_FOUND });
    }
    if (user.role !== ROLE.provider) {
      return errorResponse({ code: 'FORBIDDEN', message: 'Only providers can place bids', statusCode: HttpStatusCode.FORBIDDEN });
    }
    if (user.is_banned) {
      return errorResponse({ code: 'ACCOUNT_BANNED', message: 'Your account is banned from placing bids', statusCode: HttpStatusCode.FORBIDDEN });
    }

    const body = await request.json();
    const validation = bidSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse({ code: 'VALIDATION_ERROR', message: 'Invalid input data', statusCode: HttpStatusCode.BAD_REQUEST });
    }
    const { proposal, bidPrice } = validation.data;

    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
      select: {
        id: true,
        user_id: true,
        bids: { where: { provider_id: user.id }, select: { id: true } }
      }
    });
    if (!gig) {
      return errorResponse({ code: 'NOT_FOUND', message: 'Gig not found', statusCode: HttpStatusCode.NOT_FOUND });
    }
    if (gig.user_id === user.id) {
      return errorResponse({ code: 'INVALID_OPERATION', message: 'You cannot bid on your own gig', statusCode: HttpStatusCode.BAD_REQUEST });
    }
    if (gig.bids.length > 0) {
      return errorResponse({ code: 'DUPLICATE_BID', message: 'You have already placed a bid on this gig', statusCode: HttpStatusCode.CONFLICT });
    }

    const bid = await prisma.bid.create({
      data: { gig_id: gigId, provider_id: user.id, user_id: gig.user_id, proposal, bid_price: bidPrice, status: BID_STATUS.pending },
      select: { id: true, bid_price: true, status: true, created_at: true }
    });

    await sendNotification(io, gig.user_id.toString(), {
      title: 'New Bid Received',
      message: 'You have received a new bid on your gig',
      module: 'gigs',
      type: NOTIFICATION_TYPE.info
    });

    return safeJsonResponse({ success: true, message: 'Bid placed successfully', data: bid }, { status: HttpStatusCode.CREATED });
  } catch (error) {
    console.error('Error creating bid:', error);
    return errorResponse({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to place bid', statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
