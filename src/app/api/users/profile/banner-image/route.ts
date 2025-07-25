import { safeJson } from '@/lib/utils/safeJson';
import { getServerSession } from 'next-auth';

import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { saveFileToCloud } from '@/lib/utils/file-upload';
import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { VERIFICATION_CODES, COMMON_ERROR_MESSAGES } from '@/constants';

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return errorResponse({
      code: VERIFICATION_CODES.UNAUTHORIZED,
      message: COMMON_ERROR_MESSAGES.UNAUTHORIZED,
      statusCode: HttpStatusCode.UNAUTHORIZED
    });
  }

  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return errorResponse({
      code: VERIFICATION_CODES.VALIDATION_ERROR,
      message: 'Content-Type must be multipart/form-data',
      statusCode: HttpStatusCode.BAD_REQUEST
    });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as unknown as File;

    if (!file || !(file instanceof File)) {
      return errorResponse({
        code: VERIFICATION_CODES.VALIDATION_ERROR,
        message: 'Invalid or missing file',
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await saveFileToCloud({
      buffer,
      mimetype: file.type,
      originalname: file.name,
      size: file.size
    });

    const updatedUserProfile = await prisma.userProfile.upsert({
      where: { user_id: BigInt(userId) },
      update: { banner_url: result.secure_url },
      create: { user_id: BigInt(userId), banner_url: result.secure_url }
    });

    return successResponse({
      data: safeJson(updatedUserProfile),
      message: 'Banner image uploaded successfully',
      statusCode: HttpStatusCode.OK
    });
  } catch (error: any) {
    return errorResponse({
      code: VERIFICATION_CODES.INTERNAL_SERVER_ERROR,
      message: COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR_MESSAGE,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      details: error?.message ?? 'Unknown error occurred'
    });
  }
};
