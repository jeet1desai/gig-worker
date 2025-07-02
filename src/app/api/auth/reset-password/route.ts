import prisma from '@/lib/prisma';
import { resetPasswordSchema } from '@/schemas/be/auth';
import { ValidationError } from 'yup';
import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { verifyEmailVerificationToken } from '@/lib/tokens';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return errorResponse('VALIDATION_ERROR', 'Reset token is missing or expired.', HttpStatusCode.BAD_REQUEST, {
        fieldErrors: { token: 'Reset token is required.' },
      });
    }

    const body = await req.json();

    const { password } = await resetPasswordSchema.validate(body, {
      abortEarly: false,
      strict: true,
    });

    let payload: { userId: string };
    try {
      payload = verifyEmailVerificationToken(token);
    } catch {
      return errorResponse('INVALID_TOKEN', 'Reset password link is invalid or expired.', HttpStatusCode.BAD_REQUEST);
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.userId) },
    });

    if (!user) {
      return errorResponse('USER_NOT_FOUND', 'User not found.', HttpStatusCode.NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return successResponse(null, 'Password has been reset successfully.', HttpStatusCode.OK);
  } catch (err) {
    if (err instanceof ValidationError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of err.inner) {
        if (issue.path) fieldErrors[issue.path] = issue.message;
        else fieldErrors[''] = issue.message;
      }

      return errorResponse('VALIDATION_ERROR', 'Invalid request payload', HttpStatusCode.BAD_REQUEST, { fieldErrors });
    }

    return errorResponse('INTERNAL_SERVER_ERROR', 'Something went wrong while processing your request.', HttpStatusCode.INTERNAL_SERVER_ERROR, {
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
