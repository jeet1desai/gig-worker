import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { errorResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { BID_STATUS, GIG_STATUS } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { safeJsonResponse } from '@/utils/apiResponse';
import { sendNotification } from '@/lib/socket/socket-server';
import { getSocketServer } from '@/app/api/socket/route';
import { GIG_NOTIFICATION_MODULES, NOTIFICATION_MODULES, NOTIFICATION_TYPES } from '@/constants';

const io = getSocketServer();

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
        statusCode: HttpStatusCode.UNAUTHORIZED
      });
    }

    const { id: gigId } = await params;
    if (!gigId) {
      return errorResponse({
        code: 'BAD_REQUEST',
        message: 'Missing gig ID',
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const gig = await prisma.gig.findUnique({
      where: { id: BigInt(gigId) },
      include: {
        pipeline: true,
        bids: {
          where: { status: BID_STATUS.accepted },
          include: {
            provider: true
          }
        }
      }
    });

    if (!gig) {
      return errorResponse({
        code: 'NOT_FOUND',
        message: 'Gig not found',
        statusCode: HttpStatusCode.NOT_FOUND
      });
    }

    if (gig.pipeline?.status !== GIG_STATUS.in_progress) {
      return errorResponse({
        code: 'BAD_REQUEST',
        message: 'Gig is not in progress',
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const acceptedBid = gig.bids.find((bid) => bid.status === BID_STATUS.accepted);
    if (!acceptedBid || acceptedBid.provider_id !== BigInt(session.user.id)) {
      return errorResponse({
        code: 'FORBIDDEN',
        message: 'Only the accepted provider can mark the gig as completed',
        statusCode: HttpStatusCode.FORBIDDEN
      });
    }

    await prisma.gigPipeline.update({
      where: { gig_id: BigInt(gigId) },
      data: { status: GIG_STATUS.completed }
    });

    await prisma.gig.update({
      where: { id: BigInt(gigId) },
      data: { completed_at: new Date() }
    });

    await sendNotification(io, gig.user_id.toString(), {
      title: GIG_NOTIFICATION_MODULES.GIG_COMPLETED_TITLE,
      message: `Gig "${gig.title}" has been marked as completed by the provider.`,
      module: NOTIFICATION_MODULES.SYSTEM,
      type: NOTIFICATION_TYPES.SUCCESS
    });

    return safeJsonResponse(
      {
        message: 'Gig marked as completed successfully',
        data: { gigId }
      },
      { status: HttpStatusCode.OK }
    );
  } catch (error) {
    console.error('Error completing gig:', error);
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to complete gig',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
