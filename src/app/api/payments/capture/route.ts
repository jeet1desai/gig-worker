import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { getServerSession } from 'next-auth';
import { capturePayPalOrder } from '@/lib/paypal/orders';
import { authOptions } from '../../auth/[...nextauth]/route';
import { BID_STATUS, EARN_STATUS, PAYMENT_REQUEST_STATUS, PAYMENT_STATUS } from '@prisma/client';
import { REVIEW_RATING_STATUS } from '@/enums/be/user';
import { sendNotification } from '@/lib/socket/socket-server';
import { getSocketServer } from '@/app/api/socket/route';
import { GIG_NOTIFICATION_MODULES, NOTIFICATION_MODULES, NOTIFICATION_TYPES } from '@/constants';

const io = getSocketServer();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
        statusCode: HttpStatusCode.UNAUTHORIZED
      });
    }

    const { orderId, slug } = await request.json();

    if (!orderId || !slug) {
      return errorResponse({
        code: 'BAD_REQUEST',
        message: 'Missing order ID or slug',
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const captureResult = await capturePayPalOrder(orderId);

    if (captureResult.status !== 'COMPLETED') {
      return errorResponse({
        code: 'PAYMENT_FAILED',
        message: 'Payment capture failed',
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const gig_details = await prisma.gig.findUnique({
      where: { slug: slug }
    });

    const payment = await prisma.payment.findFirst({
      where: {
        payment_method: 'paypal',
        gig_id: gig_details?.id
      },
      include: {
        gig: {
          include: {
            user: true,
            bids: {
              where: { status: BID_STATUS.accepted },
              include: {
                provider: true
              }
            }
          }
        }
      }
    });

    if (!payment) {
      return errorResponse({
        code: 'PAYMENT_NOT_FOUND',
        message: 'Payment record not found',
        statusCode: HttpStatusCode.NOT_FOUND
      });
    }

    if (payment.status === PAYMENT_STATUS.held || payment.request_status === PAYMENT_REQUEST_STATUS.pending) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PAYMENT_STATUS.completed,
          request_status: PAYMENT_REQUEST_STATUS.accepted
        }
      });

      await sendNotification(io, payment.provider_id.toString(), {
        title: GIG_NOTIFICATION_MODULES.PAYMENT_SUCCESS_TITLE,
        message: `Payment for gig "${payment.gig.title}" has been successfully done.`,
        module: NOTIFICATION_MODULES.SYSTEM,
        type: NOTIFICATION_TYPES.SUCCESS
      });
    }

    const earning_details = await prisma.providerEarning.findFirst({ where: { gig_id: payment.gig_id, status: EARN_STATUS.completed } });

    const acceptedBid = payment.gig.bids[0];
    if (acceptedBid && !earning_details) {
      await prisma.providerEarning.create({
        data: {
          user_id: payment.gig.user_id,
          provider_id: acceptedBid.provider_id,
          gig_id: payment.gig_id,
          amount: acceptedBid.bid_price,
          status: EARN_STATUS.completed
        }
      });
    }

    await prisma.reviewRating.updateMany({
      where: { gig_id: payment.gig_id },
      data: { status: REVIEW_RATING_STATUS.APPROVED }
    });

    const responseData = {
      amount: payment.amount.toString(),
      transactionId: captureResult.purchase_units[0]?.payments?.captures[0]?.id || 'N/A',
      providerName: acceptedBid?.provider.first_name + ' ' + acceptedBid?.provider.last_name,
      gigTitle: payment.gig.title,
      paymentId: payment.id.toString()
    };

    return successResponse({
      message: 'Payment captured successfully',
      data: responseData,
      statusCode: HttpStatusCode.OK
    });
  } catch (error) {
    console.error('Error capturing payment:', error);
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to capture payment',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
