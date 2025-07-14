import { safeJson } from '@/lib/utils/safeJson';
import { getServerSession, User } from 'next-auth';
import { ROLE, SUBSCRIPTION_STATUS } from '@prisma/client';
import { ValidationError } from 'yup';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getSubscription, cancelSubscription } from '@/lib/paypal/subscriptions';
import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { getPlanByPlanId } from '@/lib/server/subscriptionPlans';
import { subscribeSchema } from '@/schemas/be/subscription';
import { COMMON_ERROR_MESSAGES, VERIFICATION_CODES } from '@/constants';
import { FREE_PLAN_ID } from '@/constants/plans';
import {
  PAYPAL_SUBSCRIPTION_CANCEL_REASON,
  PAYPAL_SUBSCRIPTION_STATUS
} from '@/enums/be/paypal';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subscriptionId, planId } = await subscribeSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true
    });
    const session = await getServerSession(authOptions);
    const { user } = session as { user: User };

    const existing = await prisma.subscription.findFirst({
      where: { user_id: BigInt(user.id), status: SUBSCRIPTION_STATUS.active },
      include: { plan: true }
    });
    if (existing) {
      if (existing.plan.plan_id === planId)
        return successResponse({
          message: 'Subscription already active for this plan',
          data: safeJson(existing)
        });
      if (existing.subscription_id)
        await cancelSubscription(
          existing.subscription_id,
          PAYPAL_SUBSCRIPTION_CANCEL_REASON.SWITCHING_PLAN
        );
      await prisma.subscription.update({
        where: { id: existing.id },
        data: { status: SUBSCRIPTION_STATUS.cancelled }
      });
    }

    if (subscriptionId) {
      const subscription = await getSubscription(subscriptionId);
      if (!subscription)
        return errorResponse({
          code: 'NOT_FOUND',
          message: 'Subscription not found',
          statusCode: HttpStatusCode.NOT_FOUND
        });
      if (subscription.status !== PAYPAL_SUBSCRIPTION_STATUS.ACTIVE)
        return errorResponse({
          code: 'INVALID_STATUS',
          message: 'Subscription is not active',
          statusCode: HttpStatusCode.BAD_REQUEST
        });
      if (user.id !== subscription.custom_id)
        return errorResponse({
          code: 'UNAUTHORIZED_USER_SUBSCRIPTION',
          message: 'Subscription does not belong to this user',
          statusCode: HttpStatusCode.UNAUTHORIZED
        });

      const planDetails = await getPlanByPlanId(subscription.plan_id);
      if (!planDetails)
        return errorResponse({
          code: 'INVALID_PLAN',
          message: 'Invalid subscription plan',
          statusCode: HttpStatusCode.BAD_REQUEST
        });

      const price = subscription.billing_info.last_payment.amount.value ?? '0.00',
        expires = subscription.billing_info.next_billing_time;

      const [sub] = await prisma.$transaction([
        prisma.subscription.upsert({
          where: { subscription_id: subscription.id },
          update: {
            amount: parseFloat(price),
            status: SUBSCRIPTION_STATUS.active,
            subscription_expires_at: expires,
            plan_id: planDetails.id
          },
          create: {
            user_id: BigInt(user.id),
            type: planDetails.type,
            amount: parseFloat(price),
            status: SUBSCRIPTION_STATUS.active,
            subscription_expires_at: expires,
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
        data: safeJson(sub)
      });
    }

    if (planId !== FREE_PLAN_ID)
      return errorResponse({
        code: 'INVALID_PLAN',
        message: 'Invalid plan for direct creation',
        statusCode: HttpStatusCode.BAD_REQUEST
      });

    const planDetails = await getPlanByPlanId(planId);
    if (!planDetails)
      return errorResponse({
        code: 'INVALID_PLAN',
        message: 'Invalid free plan',
        statusCode: HttpStatusCode.BAD_REQUEST
      });

    const [sub] = await prisma.$transaction([
      prisma.subscription.create({
        data: {
          user_id: BigInt(user.id),
          type: planDetails.type,
          amount: 0.0,
          status: SUBSCRIPTION_STATUS.active,
          subscription_expires_at: null,
          subscription_id: null,
          plan_id: planDetails.id
        }
      }),
      prisma.user.update({
        where: { id: BigInt(user.id) },
        data: { role: ROLE.user }
      })
    ]);
    return successResponse({
      message: 'Subscription created successfully',
      data: safeJson(sub)
    });
  } catch (error: any) {
    if (error instanceof ValidationError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of error.inner)
        issue.path && (fieldErrors[issue.path] = issue.message);
      return errorResponse({
        code: VERIFICATION_CODES.VALIDATION_ERROR,
        message: COMMON_ERROR_MESSAGES.VALIDATION_ERROR,
        statusCode: HttpStatusCode.BAD_REQUEST,
        fieldErrors
      });
    }
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Internal server error',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
