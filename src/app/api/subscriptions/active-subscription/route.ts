import { getServerSession } from 'next-auth';
import { SUBSCRIPTION_STATUS } from '@prisma/client';

import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse, successResponse } from '@/lib/api-response';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return errorResponse({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
        statusCode: HttpStatusCode.UNAUTHORIZED
      });
    }

    const userId = BigInt(session.user.id);

    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        user_id: userId,
        status: SUBSCRIPTION_STATUS.active
      }
    });

    if (!activeSubscription) {
      return errorResponse({
        code: 'SUBSCRIPTION_NOT_FOUND',
        message: 'No active subscription found for this user.',
        statusCode: HttpStatusCode.NOT_FOUND
      });
    }

    return successResponse({
      message: 'Active subscription fetched successfully.',
      data: activeSubscription
    });
  } catch (error: any) {
    console.error('Get subscription error:', error);

    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Internal server error',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
