import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '../../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { ROLE, BID_STATUS, NOTIFICATION_TYPE } from '@prisma/client';
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

    return safeJsonResponse(
      {
        success: true,
        message: 'Bid placed successfully',
        data: bid
      },
      { status: HttpStatusCode.CREATED }
    );
  } catch (error) {
    console.error('Error creating bid:', error);
    return errorResponse({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to place bid', statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
