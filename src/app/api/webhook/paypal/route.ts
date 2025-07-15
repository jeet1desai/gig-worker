import { ROLE, SUBSCRIPTION_STATUS, Subscription } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import prisma from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/paypal/verifyWebhook';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse, successResponse } from '@/lib/api-response';

export async function POST(req: Request) {
  const body = await req.json();

  const verified = await verifyWebhookSignature(req, body);
  if (!verified) {
    return errorResponse({
      code: 'INVALID_SIGNATURE',
      message: 'Invalid PayPal webhook signature',
      statusCode: HttpStatusCode.UNAUTHORIZED
    });
  }

  const eventType = body.event_type;

  if (!eventType.startsWith('BILLING.SUBSCRIPTION.')) {
    return successResponse({
      message: 'Event ignored: not a subscription event',
      data: null
    });
  }

  const subscriptionId = body.resource.id;
  const subscription = await prisma.subscription.findUnique({
    where: { subscription_id: subscriptionId },
    include: { user: true }
  });

  if (!subscription) {
    return successResponse({
      message: 'No matching subscription in DB; ignored.',
      data: null
    });
  }

  let newStatus: SUBSCRIPTION_STATUS | null = null;

  switch (eventType) {
    case 'BILLING.SUBSCRIPTION.ACTIVATED':
    case 'BILLING.SUBSCRIPTION.RE-ACTIVATED':
    case 'BILLING.SUBSCRIPTION.RENEWED':
      newStatus = SUBSCRIPTION_STATUS.active;
      break;
    case 'BILLING.SUBSCRIPTION.CANCELLED':
    case 'BILLING.SUBSCRIPTION.EXPIRED':
    case 'BILLING.SUBSCRIPTION.SUSPENDED':
      newStatus = SUBSCRIPTION_STATUS.cancelled;
      break;
    default:
      return successResponse({
        message: `Event ${eventType} ignored`,
        data: null
      });
  }

  const nextBillingTime = body.resource.billing_info?.next_billing_time ?? null;
  const lastPaymentValue = body.resource.billing_info?.last_payment?.amount?.value ?? null;

  const updateData: Partial<Subscription> = {
    status: newStatus
  };

  if (nextBillingTime) {
    updateData.subscription_expires_at = nextBillingTime;
  }

  if (lastPaymentValue) {
    updateData.amount = Decimal(lastPaymentValue);
  }

  await prisma.$transaction([
    prisma.subscription.update({
      where: { subscription_id: subscriptionId },
      data: updateData
    }),
    prisma.user.update({
      where: { id: subscription.user_id },
      data: {
        role: newStatus === SUBSCRIPTION_STATUS.active ? ROLE.provider : ROLE.user
      }
    })
  ]);

  return successResponse({
    message: `Subscription updated successfully for event: ${eventType}`,
    data: null
  });
}
