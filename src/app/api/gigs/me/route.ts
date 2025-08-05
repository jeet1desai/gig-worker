import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse } from '@/lib/api-response';
import { safeJsonResponse } from '@/utils/apiResponse';

// GET /api/gigs/me - Get gigs created by the logged-in user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to view your gigs',
        statusCode: HttpStatusCode.UNAUTHORIZED
      });
    }

    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const search = (searchParams.get('search') || '').trim();
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice') as string) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice') as string) : undefined;
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const startDate = startDateParam ? new Date(startDateParam) : undefined;
    const endDate = endDateParam ? new Date(endDateParam) : undefined;

    const tiersParam = searchParams.get('tiers');
    const tiers = tiersParam ? tiersParam.split(',').map((t) => t.trim().toLowerCase()) : [];

    const skip = (page - 1) * limit;

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

    if (startDate !== undefined || endDate !== undefined) {
      const dateConditions: any = {};

      if (startDate !== undefined) {
        dateConditions.start_date = { gte: startDate };
      }

      if (endDate !== undefined) {
        dateConditions.end_date = { lte: endDate };
      }

      baseWhere.AND.push(dateConditions);
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
      }),
      user_id: session.user.id,
      is_removed: false
    };

    const [total, gigs] = await Promise.all([
      prisma.gig.count({
        where: whereClause
      }),
      prisma.gig.findMany({
        where: whereClause,
        include: {
          user: {
            select: { id: true, first_name: true, last_name: true, email: true, profile_url: true, created_at: true, updated_at: true, role: true }
          },
          pipeline: { select: { id: true, status: true, created_at: true, updated_at: true } },
          _count: { select: { bids: true } }
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
            limit
          }
        }
      },
      { status: HttpStatusCode.OK }
    );
  } catch (error) {
    console.error('Error fetching user gigs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch your gigs';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: errorMessage,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
