import { ValidationError } from 'yup';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

import prisma from '@/lib/prisma';
import { resetPasswordSchema } from '@/schemas/be/auth';
import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { verifyEmailVerificationToken } from '@/lib/tokens';
import { sendNotification } from '@/lib/socket/socket-server';
import { getSocketServer } from '@/app/api/socket/route';
import { COMMON_ERROR_MESSAGES, NOTIFICATION_MODULES, NOTIFICATION_TYPES, RESET_PASSWORD_MESSAGES, VERIFICATION_CODES } from '@/constants';

const io = getSocketServer();

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = await resetPasswordSchema.validate(body, {
      abortEarly: false
    });
    const token = body.token;
    if (!token) {
      return errorResponse({
        code: VERIFICATION_CODES.VALIDATION_ERROR,
        message: RESET_PASSWORD_MESSAGES.invalidOrExpiredToken,
        statusCode: HttpStatusCode.BAD_REQUEST,
        fieldErrors: { token: 'Reset token is required.' }
      });
    }

    let payload: { userId: string };
    try {
      payload = verifyEmailVerificationToken(token);
    } catch {
      return errorResponse({
        code: VERIFICATION_CODES.INVALID_OR_EXPIRED_TOKEN,
        message: RESET_PASSWORD_MESSAGES.invalidOrExpiredToken,
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.userId) }
    });

    if (!user) {
      return errorResponse({
        code: VERIFICATION_CODES.USER_NOT_FOUND,
        message: COMMON_ERROR_MESSAGES.USER_NOT_FOUND_MESSAGE,
        statusCode: HttpStatusCode.NOT_FOUND
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    await sendNotification(io, user.id.toString(), {
      title: 'User Password Reset',
      message: RESET_PASSWORD_MESSAGES.success,
      module: NOTIFICATION_MODULES.SYSTEM,
      type: NOTIFICATION_TYPES.SUCCESS
    });

    return successResponse({
      data: null,
      message: RESET_PASSWORD_MESSAGES.success,
      statusCode: HttpStatusCode.OK
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of err.inner) {
        if (issue.path) fieldErrors[issue.path] = issue.message;
        else fieldErrors[''] = issue.message;
      }

      return errorResponse({
        code: VERIFICATION_CODES.VALIDATION_ERROR,
        message: COMMON_ERROR_MESSAGES.INVALID_REQUEST_PAYLOAD,
        statusCode: HttpStatusCode.BAD_REQUEST,
        fieldErrors
      });
    }

    return errorResponse({
      code: VERIFICATION_CODES.INTERNAL_SERVER_ERROR,
      message: COMMON_ERROR_MESSAGES.SOMETHING_WENT_WRONG_MESSAGE,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}
