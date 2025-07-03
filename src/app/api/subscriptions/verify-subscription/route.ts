import { NextResponse } from 'next/server';
import { add } from 'date-fns';
import prisma from '@/lib/prisma';
import { SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPE } from '@prisma/client';
import { getSubscription } from '@/lib/paypal/subscriptions';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subscriptionId = searchParams.get('subscriptionId');

  if (!subscriptionId) {
    return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
  }

  try {
    const subscription = await getSubscription(subscriptionId);

    if (subscription.status !== SUBSCRIPTION_STATUS.active) {
      return NextResponse.json({ error: 'Subscription is not active' }, { status: 400 });
    }

    const user = { id: 1 };
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const price = subscription.billing_info?.last_payment?.amount?.value ?? '0.00';

    const subscription_expires_at = add(new Date(), { months: 1 });

    await prisma.subscription.create({
      data: {
        user_id: BigInt(user.id),
        type: SUBSCRIPTION_TYPE.basic,
        amount: parseFloat(price),
        status: SUBSCRIPTION_STATUS.active,
        subscription_expires_at,
      },
    });

    return NextResponse.json({ success: true, data: subscription, message: 'Subscription verified successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
