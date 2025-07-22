import { getServerSession } from 'next-auth';

import prisma from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';
import { ROLE, GIG_STATUS, TIER } from '@prisma/client';
import { uploadFile } from '@/lib/utils/file-upload';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse } from '@/lib/api-response';
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

    if (user?.role !== ROLE.user) {
      return errorResponse({ code: 'FORBIDDEN', message: 'Only users can create gigs', statusCode: HttpStatusCode.FORBIDDEN });
    }

    const formData = await request.formData();

    const title = formData.get('title')?.toString();
    const description = formData.get('description')?.toString();
    const start_date = formData.get('start_date')?.toString();
    const end_date = formData.get('end_date')?.toString();
    const price_min = formData.get('price_min')?.toString();
    const price_max = formData.get('price_max')?.toString();
    const location = formData.get('location')?.toString();

    const keywords = formData.get('keywords')
      ? formData
          .get('keywords')
          ?.toString()
          .split(',')
          .map((k) => k.trim())
      : [];
    const tier = formData.get('tier')?.toString();

    if (!title || !price_min || !price_max || !tier || !description || !start_date || !location) {
      return errorResponse({
        code: 'BAD_REQUEST',
        message: 'Title, price range, tier, location, and description are required',
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
        location: location || null,
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

// GET /api/gigs - Get all gigs with pagination, search, and filtering
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const skip = (page - 1) * limit;
    const search = (searchParams.get('search') || '').trim();
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice') as string) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice') as string) : undefined;
    const deliveryTime = searchParams.get('deliveryTime') ? parseInt(searchParams.get('deliveryTime') as string) : undefined;

    const baseWhere: any = {
      AND: []
    };

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceConditions = [];

      if (minPrice !== undefined) {
        priceConditions.push({
          price_range: {
            path: ['min'],
            gte: minPrice
          }
        });
      }

      if (maxPrice !== undefined) {
        priceConditions.push({
          price_range: {
            path: ['max'],
            lte: maxPrice
          }
        });
      }

      if (priceConditions.length > 0) {
        baseWhere.AND.push({ OR: priceConditions });
      }
    }

    if (deliveryTime !== undefined) {
      const deliveryDays = parseInt(deliveryTime.toString());
      if (!isNaN(deliveryDays)) {
        const today = new Date();
        const deliveryDate = new Date();
        deliveryDate.setDate(today.getDate() + deliveryDays);

        baseWhere.AND.push({
          start_date: {
            lte: deliveryDate
          },
          end_date: {
            gte: today
          }
        });
      }
    }

    if (search) {
      const searchConditions: any = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } }
      ];

      if (!search.includes(' ')) {
        searchConditions.push({
          keywords: {
            path: ['$'],
            string_contains: search.toLowerCase()
          }
        });
      }

      baseWhere.AND.push({
        OR: searchConditions
      });
    }

    const whereClause = {
      ...baseWhere,
      pipeline: {
        is: {
          status: GIG_STATUS.open
        }
      },
      ...(session?.user?.id && {
        user_id: {
          not: session.user.id
        }
      })
    };

    const [total, gigs] = await Promise.all([
      prisma.gig.count({
        where: whereClause
      }),
      prisma.gig.findMany({
        where: whereClause,
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
          },
          pipeline: {
            select: {
              id: true,
              status: true,
              created_at: true,
              updated_at: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take: limit
      })
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    const responseData = {
      success: true,
      message: 'Gigs fetched successfully',
      data: {
        gigs,
        pagination: {
          total,
          page: currentPage,
          totalPages,
          limit
        }
      }
    };

    return safeJsonResponse(responseData, { status: HttpStatusCode.OK });
  } catch (error) {
    console.error('Error fetching gigs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch gigs';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: errorMessage,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
