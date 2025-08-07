import { getServerSession } from 'next-auth';

import prisma from '@/lib/prisma';
import { BID_STATUS, GIG_STATUS, PAYMENT_STATUS, TIER } from '@prisma/client';
import { uploadFile } from '@/lib/utils/file-upload';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { authOptions } from '../../auth/[...nextauth]/route';
import { safeJsonResponse } from '@/utils/apiResponse';
import { errorResponse } from '@/lib/api-response';

type PriceRange = {
  min: number;
  max: number;
};

// PUT /api/gigs/[id] - Update a gig
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse({ code: 'UNAUTHORIZED', message: 'You must be logged in to update a gig', statusCode: HttpStatusCode.UNAUTHORIZED });
    }

    const gigId = await params.id;
    if (!gigId) {
      return errorResponse({ code: 'BAD_REQUEST', message: 'Gig ID is required', statusCode: HttpStatusCode.BAD_REQUEST });
    }
    const existingGig = await prisma.gig.findUnique({
      where: { id: BigInt(gigId) },
      include: { user: true }
    });
    if (!existingGig) {
      return errorResponse({ code: 'NOT_FOUND', message: 'Gig not found', statusCode: HttpStatusCode.NOT_FOUND });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true }
    });
    if (!currentUser) {
      return errorResponse({ code: 'USER_NOT_FOUND', message: 'User not found', statusCode: HttpStatusCode.NOT_FOUND });
    }
    if (existingGig.user_id !== currentUser.id && currentUser.role !== 'provider') {
      return errorResponse({ code: 'FORBIDDEN', message: 'Forbidden', statusCode: HttpStatusCode.FORBIDDEN });
    }

    const formData = await request.formData();
    const title = formData.get('title')?.toString();
    const description = formData.get('description')?.toString();
    const start_date = formData.get('start_date')?.toString();
    const end_date = formData.get('end_date')?.toString();
    const price_min = formData.get('price_min')?.toString();
    const price_max = formData.get('price_max')?.toString();
    const keywords =
      formData
        .get('keywords')
        ?.toString()
        .split(',')
        .map((k) => k.trim()) || [];
    const tier = formData.get('tier')?.toString() as TIER | undefined;
    const removeThumbnail = formData.get('remove_thumbnail') === 'true';
    const removeAttachments = formData.get('remove_attachments') === 'true';

    if (!title || !price_min || !price_max || !tier || !description || !start_date) {
      return errorResponse({
        code: 'BAD_REQUEST',
        message: 'Title, price range, tier, and description are required',
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const thumbnailFile = formData.get('thumbnail') as File | null;
    let thumbnailUrl = existingGig.thumbnail as string | null;

    if (removeThumbnail) {
      thumbnailUrl = null;
    } else if (thumbnailFile?.size && thumbnailFile.size > 0) {
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
    let attachmentUrls = Array.isArray(existingGig.attachments) ? [...existingGig.attachments] : [];
    if (removeAttachments) {
      attachmentUrls = [];
    } else {
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
    }

    const priceRange: PriceRange = {
      min: parseFloat(price_min),
      max: parseFloat(price_max)
    };

    const updateData = {
      title,
      description,
      price_range: priceRange,
      keywords,
      tier,
      start_date: start_date,
      end_date: end_date ? end_date : '',
      updated_at: new Date(),
      ...(thumbnailUrl !== undefined && { thumbnail: thumbnailUrl }),
      ...(attachmentUrls.length > 0 && { attachments: attachmentUrls })
    };

    const updatedGig = await prisma.gig.update({
      where: { id: BigInt(gigId) },
      data: updateData,
      include: {
        pipeline: true
      }
    });

    return safeJsonResponse(
      {
        success: true,
        message: 'Gig updated successfully',
        data: updatedGig
      },
      { status: HttpStatusCode.OK }
    );
  } catch (error) {
    console.error('Error updating gig:', error);
    return errorResponse({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update gig', statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}

// GET /api/gigs/[id] - Get a gig with all details
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse({ code: 'UNAUTHORIZED', message: 'You must be logged in to place a bid', statusCode: HttpStatusCode.UNAUTHORIZED });
    }

    const { id: gigId } = await params;
    if (!gigId) {
      return errorResponse({ code: 'BAD_REQUEST', message: 'Gig ID is required', statusCode: HttpStatusCode.BAD_REQUEST });
    }

    const gig = await prisma.gig.findUnique({
      where: { slug: gigId },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            profile_url: true,
            created_at: true,
            is_verified: true
          }
        },
        pipeline: true,
        bids: {
          where: { status: BID_STATUS.accepted },
          include: {
            provider: true
          }
        },
        payment: true,
        review_rating: true
      }
    });

    if (!gig) {
      return errorResponse({
        code: 'NOT_FOUND',
        message: 'Gig not found',
        statusCode: HttpStatusCode.NOT_FOUND
      });
    }

    const paymentStatus = gig.payment.length > 0 ? gig.payment[0].status : PAYMENT_STATUS.held;
    const userBid = await prisma.bid.findFirst({
      where: {
        gig_id: gig.id,
        provider_id: session.user.id
      },
      select: { id: true }
    });

    let accepted_bid = null;
    if (gig.pipeline?.status === GIG_STATUS.completed || gig.pipeline?.status === GIG_STATUS.in_progress) {
      accepted_bid = await prisma.bid.findFirst({
        where: {
          gig_id: gig.id,
          status: BID_STATUS.accepted
        },
        include: {
          provider: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              profile_url: true,
              email: true
            }
          }
        }
      });
    }

    return safeJsonResponse(
      {
        success: true,
        message: 'Gig fetched successfully',
        data: {
          ...gig,
          hasBid: !!userBid,
          accepted_bid,
          paymentStatus
        }
      },
      { status: HttpStatusCode.OK }
    );
  } catch (error) {
    console.error('Error fetching gig:', error);
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch gig',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

// DELETE /api/gigs/[id] - Delete a gig
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse({ code: 'UNAUTHORIZED', message: 'You must be logged in to delete a gig', statusCode: HttpStatusCode.UNAUTHORIZED });
    }

    const { id: gigId } = params;
    if (!gigId) {
      return errorResponse({ code: 'BAD_REQUEST', message: 'Gig ID is required', statusCode: HttpStatusCode.BAD_REQUEST });
    }

    const existingGig = await prisma.gig.findUnique({
      where: { id: BigInt(gigId) },
      select: { user_id: true, id: true }
    });
    if (!existingGig) {
      return errorResponse({ code: 'NOT_FOUND', message: 'Gig not found', statusCode: HttpStatusCode.NOT_FOUND });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true }
    });
    if (!currentUser) {
      return errorResponse({ code: 'USER_NOT_FOUND', message: 'User not found', statusCode: HttpStatusCode.NOT_FOUND });
    }
    if (existingGig.user_id !== currentUser.id && currentUser.role !== 'provider') {
      return errorResponse({ code: 'FORBIDDEN', message: 'Forbidden', statusCode: HttpStatusCode.FORBIDDEN });
    }

    await prisma.gig.update({ where: { id: BigInt(gigId) }, data: { is_removed: true } });

    return safeJsonResponse(
      {
        success: true,
        message: 'Gig deleted successfully',
        data: existingGig
      },
      { status: HttpStatusCode.OK }
    );
  } catch (error) {
    console.error('Error deleting gig:', error);
    return errorResponse({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete gig', statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
