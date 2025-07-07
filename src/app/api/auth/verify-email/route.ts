import { NextRequest } from 'next/server';

import prisma from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { safeJson } from '@/lib/utils/safeJson';
import { verifyEmailVerificationToken } from '@/lib/tokens';
import { sendNotification } from '@/lib/socket/socket-server';
import { getSocketServer } from '@/app/api/socket/route';

const io = getSocketServer();

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return errorResponse({
      code: 'TOKEN_MISSING',
      message: 'Verification token is missing.',
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  }

  try {
    const { userId } = verifyEmailVerificationToken(token);

    const user = await prisma.user.findUnique({ where: { id: BigInt(userId) } });

    if (!user) {
      return errorResponse({
        code: 'USER_NOT_FOUND',
        message: 'No user found for the provided token.',
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    if (user.is_verified) {
      return successResponse({
        data: null,
        message: 'User already verified.',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: BigInt(userId) },
      data: { is_verified: true },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
      },
    });

    await sendNotification(io, userId, {
      title: 'Email Verified',
      message: 'Your email has been verified successfully.',
      module: 'system',
      type: 'success',
    });

    return successResponse({
      data: safeJson(updatedUser),
      message: 'Email verified successfully.',
    });
  } catch (err) {
    return errorResponse({
      code: 'INVALID_OR_EXPIRED_TOKEN',
      message: 'Verification token is invalid or has expired.',
      statusCode: HttpStatusCode.UNAUTHORIZED,
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
