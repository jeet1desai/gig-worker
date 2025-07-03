import { createSubscription } from '@/lib/paypal/subscriptions';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const user = { id: 1 };
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { planId } = await req.json();
  if (!planId) return NextResponse.json({ error: 'planId is required' }, { status: 422 });

  try {
    const subscription = await createSubscription({ plan_id: planId, custom_id: String(user.id) });
    return NextResponse.json({ success: true, data: subscription, message: 'Subscription created successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
