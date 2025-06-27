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
import { EMAIL_VERIFICATION_PATH } from '@/constants/app-routes';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData: SignupPayload = await signupSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { email, first_name, last_name, password } = validatedData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return errorResponse('USER_ALREADY_EXISTS', 'A user with this email already exists.', HttpStatusCode.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        first_name,
        last_name,
        password: hashedPassword,
        sign_up_type: USER_SIGNUP_TYPE.EMAIL,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
      },
    });

    const token = generateEmailVerificationToken({
      userId: user.id,
      email: user.email,
    });
    const verificationUrl = `${publicEnv.NEXT_PUBLIC_BASE_URL}${EMAIL_VERIFICATION_PATH}?token=${token}`;

    return successResponse(user, 'User created successfully', HttpStatusCode.CREATED);
  } catch (err) {
    if (err instanceof ValidationError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of err.inner) {
        if (issue.path) fieldErrors[issue.path] = issue.message;
      }

      return errorResponse('VALIDATION_ERROR', 'Invalid request payload', HttpStatusCode.BAD_REQUEST, { fieldErrors });
    }

    return errorResponse('INTERNAL_SERVER_ERROR', 'Something went wrong while creating the user.', HttpStatusCode.INTERNAL_SERVER_ERROR, {
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
