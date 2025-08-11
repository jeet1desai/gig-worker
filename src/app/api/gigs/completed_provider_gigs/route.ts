import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse } from '@/lib/api-response';
import { safeJsonResponse } from '@/utils/apiResponse';
import { BID_STATUS, GIG_STATUS, Prisma } from '@prisma/client';

interface GetGigsQueryParams {
  page: number;
  limit: number;
  search: string;
}

export async function GET(request: Request): Promise<Response> {
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

    const queryParams: GetGigsQueryParams = {
      page: Math.max(1, parseInt(searchParams.get('page') || '1', 10)),
      limit: Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10))),
      search: (searchParams.get('search') || '').trim()
    };

    const skip = (queryParams.page - 1) * queryParams.limit;

    const baseWhere: Prisma.GigWhereInput = {
      AND: [] as Prisma.GigWhereInput[]
    };

    if (queryParams.search) {
      const searchConditions: Prisma.GigWhereInput[] = [
        { title: { contains: queryParams.search, mode: 'insensitive' } },
        { description: { contains: queryParams.search, mode: 'insensitive' } }
      ];

      if (!queryParams.search.includes(' ')) {
        searchConditions.push({
          keywords: {
            path: ['$'],
            string_contains: queryParams.search.toLowerCase()
          } as any
        });
      }

      (baseWhere.AND as Prisma.GigWhereInput[]).push({
        OR: searchConditions
      });
    }

    const whereClause: Prisma.GigWhereInput = {
      ...baseWhere,
      is_removed: false,
      pipeline: {
        status: GIG_STATUS.completed
      },
      bids: {
        some: {
          status: BID_STATUS.accepted,
          provider_id: session.user.id
        }
      }
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
          payment: true,
          review_rating: true,
          _count: { select: { bids: true } }
        },
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take: queryParams.limit
      })
    ]);

    const totalPages = Math.max(1, Math.ceil(total / queryParams.limit));
    const currentPage = Math.min(queryParams.page, totalPages);

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
            limit: queryParams.limit
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
