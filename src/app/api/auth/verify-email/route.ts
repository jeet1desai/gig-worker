import { NextRequest } from 'next/server';

import prisma from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { safeJson } from '@/lib/utils/safeJson';
import { verifyEmailVerificationToken } from '@/lib/tokens';
import { sendNotification } from '@/lib/socket/socket-server';
import { getSocketServer } from '@/app/api/socket/route';
import { COMMON_ERROR_MESSAGES, TOKEN, VERIFICATION_CODES, VERIFICATION_MESSAGES } from '@/constants';

const io = getSocketServer();

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get(TOKEN);

  if (!token) {
    return errorResponse({
      code: VERIFICATION_CODES.TOKEN_MISSING,
      message: VERIFICATION_MESSAGES.TOKEN_MISSING,
      statusCode: HttpStatusCode.BAD_REQUEST
    });
  }

  try {
    const { userId } = verifyEmailVerificationToken(token);

    const user = await prisma.user.findUnique({ where: { id: BigInt(userId) } });

    if (!user) {
      return errorResponse({
        code: VERIFICATION_CODES.USER_NOT_FOUND,
        message: COMMON_ERROR_MESSAGES.USER_NOT_FOUND_MESSAGE,
        statusCode: HttpStatusCode.NOT_FOUND
      });
    }

    if (user.is_verified) {
      return successResponse({
        data: null,
        message: VERIFICATION_MESSAGES.USER_ALREADY_VERIFIED
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: BigInt(userId) },
      data: { is_verified: true },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true
      }
    });

    await sendNotification(io, userId, {
      title: VERIFICATION_MESSAGES.EMAIL_VERIFIED_NOTIFICATION_TITLE,
      message: VERIFICATION_MESSAGES.EMAIL_VERIFIED_NOTIFICATION_MESSAGE,
      module: 'system',
      type: 'success'
    });

    return successResponse({
      data: safeJson(updatedUser),
      message: VERIFICATION_MESSAGES.EMAIL_VERIFIED_SUCCESS
    });
  } catch (err) {
    return errorResponse({
      code: VERIFICATION_CODES.INVALID_OR_EXPIRED_TOKEN,
      message: VERIFICATION_MESSAGES.INVALID_OR_EXPIRED_TOKEN,
      statusCode: HttpStatusCode.UNAUTHORIZED,
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}
