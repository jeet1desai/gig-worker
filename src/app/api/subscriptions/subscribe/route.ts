import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getSubscription } from '@/lib/paypal/subscriptions';
import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session)
    return errorResponse({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
      statusCode: HttpStatusCode.UNAUTHORIZED
    });

  const { subscriptionId } = await req.json();
  if (!subscriptionId)
    return errorResponse({
      code: 'BAD_REQUEST',
      message: 'Subscription ID is required',
      statusCode: HttpStatusCode.BAD_REQUEST
    });

  try {
    const subscription = await getSubscription(subscriptionId);
    return successResponse({
      data: subscription,
      message: 'Subscription created successfully'
    });
  } catch (err: any) {
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
