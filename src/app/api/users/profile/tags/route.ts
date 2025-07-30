import { getServerSession } from 'next-auth';
import * as yup from 'yup';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { VERIFICATION_CODES, COMMON_ERROR_MESSAGES } from '@/constants';
import { errorResponse, successResponse } from '@/lib/api-response';
import { profileTagsSchema } from '@/schemas/be/user';
import { safeJson } from '@/lib/utils/safeJson';

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return errorResponse({
      code: VERIFICATION_CODES.UNAUTHORIZED,
      message: COMMON_ERROR_MESSAGES.UNAUTHORIZED,
      statusCode: HttpStatusCode.UNAUTHORIZED
    });
  }

  try {
    const body = await req.json();
    const validated = await profileTagsSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true
    });

    const { skills, interests, extracurricular } = validated;
    const cleanedSkills = skills?.filter((s): s is string => typeof s === 'string');
    const cleanedInterests = interests?.filter((i): i is string => typeof i === 'string');
    const cleanedExtracurricular = extracurricular?.filter((e): e is string => typeof e === 'string');

    const updatedProfile = await prisma.userProfile.upsert({
      where: { user_id: BigInt(userId) },
      update: {
        ...(cleanedSkills && { skills: cleanedSkills }),
        ...(cleanedInterests && { interests: cleanedInterests }),
        ...(cleanedExtracurricular && {
          extracurricular: cleanedExtracurricular
        })
      },
      create: {
        user_id: BigInt(userId),
        ...(cleanedSkills && { skills: cleanedSkills }),
        ...(cleanedInterests && { interests: cleanedInterests }),
        ...(cleanedExtracurricular && {
          extracurricular: cleanedExtracurricular
        })
      }
    });

    return successResponse({
      data: safeJson(updatedProfile),
      message: 'Profile tags updated successfully',
      statusCode: HttpStatusCode.OK
    });
  } catch (err) {
    if (err instanceof yup.ValidationError) {
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
      message: COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR_MESSAGE,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}
