import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { errorResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { getServerSession } from 'next-auth';
import { createPayPalOrder } from '@/lib/paypal/orders';
import { Decimal } from '@prisma/client/runtime/library';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { BID_STATUS, GIG_STATUS, PAYMENT_REQUEST_STATUS, PAYMENT_STATUS, RatingStatus } from '@prisma/client';
import { safeJsonResponse } from '@/utils/apiResponse';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse({ code: 'UNAUTHORIZED', message: 'Unauthorized', statusCode: HttpStatusCode.UNAUTHORIZED });
    }

    const gigId = params.id;
    const { rating, rating_feedback } = await request.json();

    if (!gigId) {
      return errorResponse({ code: 'BAD_REQUEST', message: 'Missing gig ID', statusCode: HttpStatusCode.BAD_REQUEST });
    }

    const gig = await prisma.gig.findUnique({
      where: { id: BigInt(gigId) },
      include: {
        pipeline: true,
        bids: { where: { status: BID_STATUS.accepted }, include: { provider: true } },
        review_rating: true,
        payment: { where: { status: { in: [PAYMENT_STATUS.held, PAYMENT_STATUS.failed] }, request_status: PAYMENT_REQUEST_STATUS.pending } }
      }
    });

    if (!gig) {
      return errorResponse({ code: 'NOT_FOUND', message: 'Gig not found', statusCode: HttpStatusCode.NOT_FOUND });
    }

    if (gig.pipeline?.status !== GIG_STATUS.completed) {
      return errorResponse({ code: 'BAD_REQUEST', message: 'Gig is not completed yet', statusCode: HttpStatusCode.BAD_REQUEST });
    }

    if (gig.user_id !== BigInt(session.user.id)) {
      return errorResponse({ code: 'FORBIDDEN', message: 'Only the gig owner can submit reviews', statusCode: HttpStatusCode.FORBIDDEN });
    }

    const acceptedBid = gig.bids.find((bid) => bid.status === BID_STATUS.accepted);
    if (!acceptedBid) {
      return errorResponse({ code: 'BAD_REQUEST', message: 'No accepted bid found for this gig', statusCode: HttpStatusCode.BAD_REQUEST });
    }

    let responseData: { [key: string]: any } = {
      review: gig.review_rating,
      requiresPayment: false,
      paymentOrder: null,
      payment: null
    };

    if (gig.review_rating && gig.payment.length > 0) {
      try {
        const payment = gig.payment[0];
        const paypalOrder = await createPayPalOrder({
          amount: payment.amount.toString(),
          gigId: gigId,
          paymentId: payment.id.toString(),
          description: `Payment for gig: ${gig.title}`
        });

        responseData.requiresPayment = true;
        responseData.paymentOrder = paypalOrder;
        responseData.payment = payment;

        return safeJsonResponse(
          { message: 'Pending payment found. Please complete the payment.', data: responseData },
          { status: HttpStatusCode.OK }
        );
      } catch (error) {
        console.error('Error creating PayPal order:', error);
        return errorResponse({ code: 'PAYMENT_ERROR', message: 'Failed to create payment order', statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR });
      }
    }

    if (gig.review_rating) {
      return errorResponse({ code: 'BAD_REQUEST', message: 'Review already submitted for this gig', statusCode: HttpStatusCode.BAD_REQUEST });
    }

    if (!rating || rating < 1 || rating > 5) {
      return errorResponse({ code: 'BAD_REQUEST', message: 'Rating must be between 1 and 5', statusCode: HttpStatusCode.BAD_REQUEST });
    }

    const reviewRating = await prisma.reviewRating.create({
      data: {
        gig_id: BigInt(gigId),
        provider_id: acceptedBid.provider_id,
        user_id: BigInt(session.user.id),
        rating,
        rating_feedback: rating_feedback || null,
        status: RatingStatus.pending
      }
    });

    responseData.review = reviewRating;

    if (rating >= 3) {
      const payment = await prisma.payment.create({
        data: {
          gig_id: BigInt(gigId),
          provider_id: acceptedBid.provider_id,
          amount: acceptedBid.bid_price,
          platform_fee: acceptedBid.bid_price.mul(new Decimal('0.1')),
          payment_method: 'paypal',
          status: PAYMENT_STATUS.held,
          request_status: PAYMENT_REQUEST_STATUS.pending
        }
      });

      try {
        const paypalOrder = await createPayPalOrder({
          amount: acceptedBid.bid_price.toString(),
          gigId: gigId,
          paymentId: payment.id.toString(),
          description: `Payment for gig: ${gig.title}`
        });

        responseData.requiresPayment = true;
        responseData.paymentOrder = paypalOrder;
        responseData.payment = payment;
      } catch (error) {
        console.error('Error creating PayPal order:', error);
        return errorResponse({ code: 'PAYMENT_ERROR', message: 'Failed to create payment order', statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR });
      }
    } else {
      await prisma.complaint.create({
        data: {
          review_rating_id: reviewRating.id,
          provider_id: acceptedBid.provider_id,
          user_id: BigInt(session.user.id),
          gig_id: BigInt(gigId),
          issue_text: `Low rating (${rating}/5) submitted for this gig. Payment withheld due to unsatisfactory service.`,
          suggested_improvement: rating_feedback || 'Service quality needs improvement'
        }
      });
    }

    return safeJsonResponse(
      {
        message: rating >= 3 ? 'Review submitted successfully. Please complete payment.' : 'Review submitted. Complaint filed due to low rating.',
        data: responseData
      },
      { status: HttpStatusCode.OK }
    );
  } catch (error) {
    console.error('Error submitting review:', error);
    return errorResponse({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to submit review', statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
