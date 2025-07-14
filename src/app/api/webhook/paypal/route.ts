import { ROLE, SUBSCRIPTION_STATUS, Subscription } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import prisma from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/paypal/verifyWebhook';
import { cancelSubscription } from '@/lib/paypal/subscriptions';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse, successResponse } from '@/lib/api-response';
import { PAYPAL_SUBSCRIPTION_CANCEL_REASON } from '@/enums/be/paypal';
import { getPlanByPlanId } from '@/lib/server/subscriptionPlans';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!(await verifyWebhookSignature(req, body)))
      return errorResponse({
        code: 'INVALID_SIGNATURE',
        message: 'Invalid signature',
        statusCode: HttpStatusCode.UNAUTHORIZED
      });

    const { event_type, resource } = body;
    if (!event_type.startsWith('BILLING.SUBSCRIPTION.'))
      return successResponse({ message: 'Ignored non-subscription event', data: null });
    if (event_type === 'BILLING.SUBSCRIPTION.CREATED')
      return successResponse({ message: 'CREATED ignored', data: null });

    const subId = resource.id,
      userId = resource.custom_id;
    if (!userId || !subId)
      return errorResponse({
        code: 'INVALID_PAYLOAD',
        message: 'Missing custom_id or subscription_id',
        statusCode: HttpStatusCode.BAD_REQUEST
      });

    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
      include: { subscriptions: true }
    });
    if (!user)
      return errorResponse({
        code: 'USER_NOT_FOUND',
        message: 'No user for custom_id',
        statusCode: HttpStatusCode.NOT_FOUND
      });

    let sub = user.subscriptions.find((s) => s.subscription_id === subId);

    const statusMap: Record<string, SUBSCRIPTION_STATUS> = {
      'BILLING.SUBSCRIPTION.ACTIVATED': SUBSCRIPTION_STATUS.active,
      'BILLING.SUBSCRIPTION.RE-ACTIVATED': SUBSCRIPTION_STATUS.active,
      'BILLING.SUBSCRIPTION.RENEWED': SUBSCRIPTION_STATUS.active,
      'BILLING.SUBSCRIPTION.CANCELLED': SUBSCRIPTION_STATUS.cancelled,
      'BILLING.SUBSCRIPTION.EXPIRED': SUBSCRIPTION_STATUS.cancelled,
      'BILLING.SUBSCRIPTION.SUSPENDED': SUBSCRIPTION_STATUS.cancelled
    };

    const newStatus = statusMap[event_type];
    if (!sub) {
      if (event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
        const plan = await getPlanByPlanId(resource.plan_id);
        if (!plan)
          return errorResponse({
            code: 'INVALID_PLAN',
            message: 'Invalid plan_id',
            statusCode: HttpStatusCode.BAD_REQUEST
          });

        sub = await prisma.subscription.create({
          data: {
            user_id: user.id,
            plan_id: plan.id,
            subscription_id: subId,
            status: SUBSCRIPTION_STATUS.active,
            subscription_expires_at: resource.billing_info?.next_billing_time ?? null,
            amount: resource.billing_info?.last_payment?.amount?.value
              ? Decimal(resource.billing_info.last_payment.amount.value)
              : new Decimal(0)
          }
        });
        await prisma.user.update({
          where: { id: user.id },
          data: { role: ROLE.provider }
        });
        return successResponse({
          message: 'Subscription created on ACTIVATED',
          data: null
        });
      }
      return errorResponse({
        code: 'SUBSCRIPTION_NOT_FOUND',
        message: `No subscription for ${event_type}`,
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    if (!newStatus)
      return successResponse({ message: `Ignored ${event_type}`, data: null });

    const data: Partial<Subscription> = {
      status: newStatus,
      subscription_expires_at:
        resource.billing_info?.next_billing_time ?? sub.subscription_expires_at,
      amount: resource.billing_info?.last_payment?.amount?.value
        ? Decimal(resource.billing_info.last_payment.amount.value)
        : sub.amount
    };

    if (newStatus === SUBSCRIPTION_STATUS.active) {
      const old = user.subscriptions.find(
        (s) => s.status === SUBSCRIPTION_STATUS.active && s.subscription_id !== subId
      );
      if (old) {
        await cancelSubscription(
          old.subscription_id!,
          PAYPAL_SUBSCRIPTION_CANCEL_REASON.SWITCHING_PLAN
        );
        await prisma.subscription.update({
          where: { id: old.id },
          data: { status: SUBSCRIPTION_STATUS.cancelled }
        });
      }
    }

    await prisma.$transaction([
      prisma.subscription.update({ where: { id: sub.id }, data }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          role: newStatus === SUBSCRIPTION_STATUS.active ? ROLE.provider : ROLE.user
        }
      })
    ]);

    return successResponse({
      message: `Subscription updated for ${event_type}`,
      data: null
    });
  } catch (err: any) {
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Internal error',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
