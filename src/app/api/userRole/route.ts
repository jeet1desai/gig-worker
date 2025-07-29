import { ValidationError } from 'yup';
import prisma from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { COMMON_ERROR_MESSAGES, USER_ROLE, VERIFICATION_CODES } from '@/constants';
import { roleChangeSchema } from '@/schemas/be/auth';
import { SUBSCRIPTION_STATUS } from '@/enums/be/user';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, profile_view } = await roleChangeSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true
    });

    const numericUserId = Number(userId);

    const user = await prisma.user.findUnique({
      where: { id: numericUserId }
    });

    if (!user) {
      return errorResponse({
        code: VERIFICATION_CODES.USER_NOT_FOUND,
        message: COMMON_ERROR_MESSAGES.USER_NOT_FOUND_MESSAGE,
        statusCode: HttpStatusCode.NOT_FOUND
      });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        user_id: numericUserId,
        status: SUBSCRIPTION_STATUS.ACTIVE, 
        type: { in: ['basic', 'pro'] }
      }
    });

    if (!subscription) {
      return errorResponse({
        code: VERIFICATION_CODES.VALIDATION_ERROR,
        message: USER_ROLE.subscriptionRequired,
        statusCode: HttpStatusCode.FORBIDDEN
      });
    }

    await prisma.user.update({
      where: { id: numericUserId },
      data: { 
        profile_view: profile_view.toUpperCase() as any
      }
    });

    return successResponse({
      data: { profile_view },
      message: `Profile status successfully updated to ${profile_view}.`,
      statusCode: HttpStatusCode.OK
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      const fieldErrors = Object.fromEntries(err.inner.map((e) => [e.path ?? 'unknown', e.message]));

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
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}