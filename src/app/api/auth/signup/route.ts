import bcrypt from 'bcryptjs';
import { ValidationError } from 'yup';
import prisma from '@/lib/prisma';
import { signupSchema } from '@/schemas/be/auth';
import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { SignupPayload } from '@/types/be/auth';
import { USER_SIGNUP_TYPE } from '@/enums/be/user';
import { publicEnv } from '@/lib/config/publicEnv';
import { generateEmailVerificationToken } from '@/lib/tokens';
import { PUBLIC_ROUTE } from '@/constants/app-routes';
import { getVerificationEmail } from '@/lib/email/templates/emailVerification';
import { sendEmail } from '@/lib/email/sendEmail';
import { safeJson } from '@/lib/utils/safeJson';
import { sendNotification } from '@/lib/socket/socket-server';
import { getSocketServer } from '@/app/api/socket/route';
import {
  BCRYPT_SALT_ROUNDS,
  COMMON_ERROR_MESSAGES,
  NOTIFICATION_MESSAGES,
  NOTIFICATION_MODULES,
  NOTIFICATION_TYPES,
  SIGNUP_MESSAGES,
  VERIFICATION_CODES
} from '@/constants';
const io = getSocketServer();

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData: SignupPayload = await signupSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true
    });

    const { email, first_name, last_name, password } = validatedData;

    const formattedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: formattedEmail }
    });
    if (existingUser) {
      return errorResponse({
        code: VERIFICATION_CODES.USER_ALREADY_EXISTS,
        message: SIGNUP_MESSAGES.USER_ALREADY_EXISTS,
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: formattedEmail,
        first_name,
        last_name,
        password: hashedPassword,
        sign_up_type: USER_SIGNUP_TYPE.EMAIL
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true
      }
    });

    const safeUser = safeJson(user);
    const token = generateEmailVerificationToken({
      userId: safeUser.id,
      email: user.email
    });

    await sendNotification(io, user.id.toString(), {
      title: NOTIFICATION_MESSAGES.USER_CREATED_TITLE,
      message: NOTIFICATION_MESSAGES.USER_CREATED,
      module: NOTIFICATION_MODULES.SYSTEM,
      type: NOTIFICATION_TYPES.SUCCESS
    });

    const userName = `${first_name} ${last_name}`;
    const verificationUrl = `${publicEnv.NEXT_PUBLIC_BASE_URL}${PUBLIC_ROUTE.EMAIL_VERIFICATION_PATH}?token=${token}`;
    const { subject, html } = getVerificationEmail({
      userName,
      actionLink: verificationUrl
    });

    await sendEmail({ to: email, subject, html });

    return successResponse({
      data: safeUser,
      message: SIGNUP_MESSAGES.USER_CREATED_SUCCESS,
      statusCode: HttpStatusCode.CREATED
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of err.inner) {
        if (issue.path) fieldErrors[issue.path] = issue.message;
      }

      return errorResponse({
        code: VERIFICATION_CODES.VALIDATION_ERROR,
        message: COMMON_ERROR_MESSAGES.VALIDATION_ERROR,
        statusCode: HttpStatusCode.BAD_REQUEST,
        fieldErrors
      });
    }

    return errorResponse({
      code: VERIFICATION_CODES.INTERNAL_SERVER_ERROR,
      message: SIGNUP_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}
