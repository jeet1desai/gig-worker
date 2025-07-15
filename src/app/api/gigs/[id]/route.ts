import { getServerSession } from 'next-auth';

import prisma from '@/lib/prisma';
import { TIER } from '@prisma/client';
import { uploadFile } from '@/lib/utils/file-upload';
import { errorResponse, safeJsonResponse } from '@/utils/apiResponse';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { authOptions } from '../../auth/[...nextauth]/route';

type PriceRange = {
  min: number;
  max: number;
};

// PUT /api/gigs/[id] - Update a gig
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse('Unauthorized', HttpStatusCode.UNAUTHORIZED);
    }

    const gigId = await params.id;
    if (!gigId) {
      return errorResponse('Gig ID is required', HttpStatusCode.BAD_REQUEST);
    }
    const existingGig = await prisma.gig.findUnique({
      where: { id: BigInt(gigId) },
      include: { user: true }
    });
    if (!existingGig) {
      return errorResponse('Gig not found', HttpStatusCode.NOT_FOUND);
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true }
    });
    if (!currentUser) {
      return errorResponse('User not found', HttpStatusCode.NOT_FOUND);
    }
    if (existingGig.user_id !== currentUser.id && currentUser.role !== 'provider') {
      return errorResponse('Forbidden', HttpStatusCode.FORBIDDEN);
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
      return errorResponse('Title, price range, tier, and description are required', HttpStatusCode.BAD_REQUEST);
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
        return errorResponse('Failed to upload thumbnail', HttpStatusCode.INTERNAL_SERVER_ERROR);
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
            return errorResponse('Failed to upload attachment', HttpStatusCode.INTERNAL_SERVER_ERROR);
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
    return errorResponse('Failed to update gig', HttpStatusCode.INTERNAL_SERVER_ERROR, {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// GET /api/gigs/[id] - Get a gig with all details
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const gigId = await params.id;
    if (!gigId) {
      return errorResponse('Gig ID is required', HttpStatusCode.BAD_REQUEST);
    }

    const gig = await prisma.gig.findUnique({
      where: { id: BigInt(gigId) },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            profile_url: true,
            created_at: true,
            updated_at: true,
            role: true
          }
        }
      }
    });

    if (!gig) {
      return errorResponse('Gig not found', HttpStatusCode.NOT_FOUND);
    }

    return safeJsonResponse(
      {
        success: true,
        message: 'Gig fetched successfully',
        data: gig
      },
      { status: HttpStatusCode.OK }
    );
  } catch (error) {
    console.error('Error fetching gig:', error);
    return errorResponse('Failed to fetch gig', HttpStatusCode.INTERNAL_SERVER_ERROR, {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// DELETE /api/gigs/[id] - Delete a gig
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse('Unauthorized', HttpStatusCode.UNAUTHORIZED);
    }

    const { id: gigId } = params;
    if (!gigId) {
      return errorResponse('Gig ID is required', HttpStatusCode.BAD_REQUEST);
    }

    const existingGig = await prisma.gig.findUnique({
      where: { id: BigInt(gigId) },
      select: { user_id: true, id: true }
    });
    if (!existingGig) {
      return errorResponse('Gig not found', HttpStatusCode.NOT_FOUND, { gigId });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true }
    });
    if (!currentUser) {
      return errorResponse('User not found', HttpStatusCode.NOT_FOUND);
    }
    if (existingGig.user_id !== currentUser.id && currentUser.role !== 'provider') {
      return errorResponse('Forbidden', HttpStatusCode.FORBIDDEN);
    }

    await prisma.gigPipeline.deleteMany({
      where: { gig_id: BigInt(gigId) }
    });
    await prisma.gig.delete({
      where: { id: BigInt(gigId) }
    });

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
    return errorResponse('Failed to delete gig', HttpStatusCode.INTERNAL_SERVER_ERROR, {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
