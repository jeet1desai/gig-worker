import { getServerSession } from 'next-auth';

import prisma from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';
import { ROLE, GIG_STATUS, TIER } from '@prisma/client';
import { uploadFile } from '@/lib/utils/file-upload';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse, successResponse } from '@/lib/api-response';
import { safeJsonResponse } from '@/utils/apiResponse';

// POST /api/gigs - Create a new gig
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse({ code: 'UNAUTHORIZED', message: 'Unauthorized', statusCode: HttpStatusCode.UNAUTHORIZED });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user) {
      return errorResponse({ code: 'USER_NOT_FOUND', message: 'User not found', statusCode: HttpStatusCode.NOT_FOUND });
    }

    if (user?.role !== ROLE.provider) {
      return errorResponse({ code: 'FORBIDDEN', message: 'Only providers can create gigs', statusCode: HttpStatusCode.FORBIDDEN });
    }

    const formData = await request.formData();

    const title = formData.get('title')?.toString();
    const description = formData.get('description')?.toString();
    const start_date = formData.get('start_date')?.toString();
    const end_date = formData.get('end_date')?.toString();
    const price_min = formData.get('price_min')?.toString();
    const price_max = formData.get('price_max')?.toString();
    const keywords = formData.get('keywords')
      ? formData
          .get('keywords')
          ?.toString()
          .split(',')
          .map((k) => k.trim())
      : [];
    const tier = formData.get('tier')?.toString();

    if (!title || !price_min || !price_max || !tier || !description || !start_date) {
      return errorResponse({
        code: 'BAD_REQUEST',
        message: 'Title, price range, tier, and description are required',
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const thumbnailFile = formData.get('thumbnail') as File | null;
    let thumbnailUrl: string | null = null;
    if (thumbnailFile && thumbnailFile.size > 0) {
      try {
        const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
        const uploadResult = await uploadFile({
          buffer: thumbnailBuffer,
          mimetype: thumbnailFile.type,
          originalname: thumbnailFile.name,
          size: thumbnailFile.size
        });
        thumbnailUrl = uploadResult.secure_url;
      } catch (error) {
        return errorResponse({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upload thumbnail',
          statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
        });
      }
    }

    const attachmentFiles = formData.getAll('attachments') as File[];
    const attachmentUrls: string[] = [];
    for (const file of attachmentFiles) {
      if (file.size > 0) {
        try {
          const fileBuffer = Buffer.from(await file.arrayBuffer());
          const uploadResult = await uploadFile({
            buffer: fileBuffer,
            mimetype: file.type,
            originalname: file.name,
            size: file.size
          });
          attachmentUrls.push(uploadResult.secure_url);
        } catch (error) {
          return errorResponse({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to upload attachment',
            statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
          });
        }
      }
    }

    const gig = await prisma.gig.create({
      data: {
        title,
        description: description || null,
        price_range: {
          min: parseFloat(price_min),
          max: parseFloat(price_max)
        },
        keywords: keywords || [],
        tier: (tier as TIER) || TIER.basic,
        start_date: start_date || null,
        end_date: end_date || null,
        thumbnail: thumbnailUrl || '',
        attachments: attachmentUrls || [],
        user: {
          connect: { id: session.user.id }
        },
        pipeline: {
          create: {
            status: GIG_STATUS.open
          }
        }
      },
      include: {
        pipeline: true
      }
    });

    return safeJsonResponse(
      {
        success: true,
        message: 'Gig created successfully',
        data: gig
      },
      { status: HttpStatusCode.CREATED }
    );
  } catch (error) {
    console.error('Error creating gig:', error);
    return errorResponse({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error', statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
