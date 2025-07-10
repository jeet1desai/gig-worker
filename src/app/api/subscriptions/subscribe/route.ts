import { getServerSession } from 'next-auth';
import { ROLE, SUBSCRIPTION_STATUS } from '@prisma/client';

import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getSubscription } from '@/lib/paypal/subscriptions';
import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { getPlanByPlanId } from '@/lib/server/subscriptionPlans';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return errorResponse({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
        statusCode: HttpStatusCode.UNAUTHORIZED
      });
    }

    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return errorResponse({
        code: 'BAD_REQUEST',
        message: 'Subscription ID is required',
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const { user } = session;
    const subscription = await getSubscription(subscriptionId);

    if (!subscription) {
      return errorResponse({
        code: 'NOT_FOUND',
        message: 'Subscription not found',
        statusCode: HttpStatusCode.NOT_FOUND
      });
    }

    if (subscription.status !== 'ACTIVE') {
      return errorResponse({
        code: 'INVALID_STATUS',
        message: 'Subscription is not active',
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    if (user.id !== subscription.custom_id) {
      return errorResponse({
        code: 'UNAUTHORIZED_USER_SUBSCRIPTION',
        message: 'Subscription does not belong to this user',
        statusCode: HttpStatusCode.UNAUTHORIZED
      });
    }

    const planDetails = await getPlanByPlanId(subscription.plan_id);
    if (!planDetails) {
      return errorResponse({
        code: 'INVALID_PLAN',
        message: 'Invalid subscription plan',
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const price = subscription.billing_info.last_payment.amount.value ?? '0.00';
    const subscription_expires_at = subscription.billing_info.next_billing_time;

    await prisma.$transaction([
      prisma.subscription.upsert({
        where: { subscription_id: subscription.id },
        update: {
          amount: parseFloat(price),
          status: SUBSCRIPTION_STATUS.active,
          subscription_expires_at,
          plan_id: planDetails.id
        },
        create: {
          user_id: BigInt(user.id),
          type: planDetails.type,
          amount: parseFloat(price),
          status: SUBSCRIPTION_STATUS.active,
          subscription_expires_at,
          subscription_id: subscription.id,
          plan_id: planDetails.id
        }
      }),
      prisma.user.update({
        where: { id: BigInt(user.id) },
        data: { role: ROLE.provider }
      })
    ]);

    return successResponse({
      message: 'Subscription created successfully',
      data: null
    });
  } catch (error: any) {
    console.error('Subscribe route error:', error);

    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Internal server error',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
