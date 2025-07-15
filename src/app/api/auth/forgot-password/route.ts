import { sendEmail } from '@/lib/email/sendEmail';
import prisma from '@/lib/prisma';
import { forgotPasswordSchema } from '@/schemas/be/auth';
import { ValidationError } from 'yup';
import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { publicEnv } from '@/lib/config/publicEnv';
import { PUBLIC_ROUTE } from '@/constants/app-routes';
import { generateEmailVerificationToken } from '@/lib/tokens';
import { getResetPasswordEmail } from '@/lib/email/templates/resetPassword';
import { forgotPasswordPayload } from '@/types/be/auth';
import {
  COMMON_ERROR_MESSAGES,
  FORGOT_PASSWORD_MESSAGES,
  VERIFICATION_CODES
} from '@/constants';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = (await forgotPasswordSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true
    })) as forgotPasswordPayload;

    const formattedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: formattedEmail } });

    if (!user) {
      return errorResponse({
        code: VERIFICATION_CODES.USER_NOT_FOUND,
        message: COMMON_ERROR_MESSAGES.EMAIL_NOT_EXISTS,
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const token = generateEmailVerificationToken({
      userId: user.id.toString(),
      email: user.email
    });

    const resetUrl = `${publicEnv.NEXT_PUBLIC_BASE_URL}${PUBLIC_ROUTE.RESET_PASSWORD_PAGE_PATH}?token=${token}`;
    const userName = user.email;
    const { subject, html } = getResetPasswordEmail({ userName, actionLink: resetUrl });

    await sendEmail({ to: user.email, subject, html });

    return successResponse({
      data: null,
      message: FORGOT_PASSWORD_MESSAGES.success,
      statusCode: HttpStatusCode.OK
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of err.inner) {
        if (issue.path) fieldErrors[issue.path] = issue.message;
      }
      return errorResponse({
        code: COMMON_ERROR_MESSAGES.VALIDATION_ERROR,
        message: COMMON_ERROR_MESSAGES.INVALID_REQUEST_PAYLOAD,
        statusCode: HttpStatusCode.BAD_REQUEST,
        fieldErrors
      });
    }
    return errorResponse({
      code: VERIFICATION_CODES.INTERNAL_SERVER_ERROR,
      message: COMMON_ERROR_MESSAGES.SOMETHING_WENT_WRONG_MESSAGE,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
