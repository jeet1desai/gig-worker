import prisma from '@/lib/prisma';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse } from '@/lib/api-response';
import { safeJsonResponse } from '@/utils/apiResponse';
import { checkAdminRole } from '@/utils/checkAdminRole';
import { GIG_STATUS } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const roleCheck = await checkAdminRole(request);
    if ('status' in roleCheck) return roleCheck;

    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get('pageSize') || '10'))
    );
    const search = (searchParams.get('search') || '').trim();
    const minPrice = searchParams.get('minPrice')
      ? parseFloat(searchParams.get('minPrice') as string)
      : undefined;
    const maxPrice = searchParams.get('maxPrice')
      ? parseFloat(searchParams.get('maxPrice') as string)
      : undefined;
    const tiersParam = searchParams.get('tiers');
    const rating = searchParams.get('rating');
    const status = searchParams.get('status');
    const tiers = tiersParam
      ? tiersParam.split(',').map((t) => t.trim().toLowerCase())
      : [];

    const skip = (page - 1) * pageSize;

    const baseWhere: any = {
      AND: [{ is_removed: false }]
    };

    if (status) {
      baseWhere.AND.push({
        pipeline: {
          status: status as GIG_STATUS
        }
      });
    }

    if (rating) {
      const parsedRating = parseFloat(rating);
      if (!isNaN(parsedRating)) {
        baseWhere.AND.push({
          review_rating: {
            rating: {
              gte: parsedRating
            }
          }
        });
      }
    }

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
      ...(tiers.length > 0 && {
        tier: {
          in: tiers
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
          },
          bids: true
        },
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take: pageSize
      })
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(page, totalPages);

    return safeJsonResponse(
      {
        success: true,
        message: 'Your gigs fetched successfully',
        data: {
          gigs,
          pagination: {
            total,
            page: currentPage,
            totalPages,
            pageSize
          }
        }
      },
      { status: HttpStatusCode.OK }
    );
  } catch (error) {
    console.error('Error fetching user gigs:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch your gigs';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: errorMessage,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
