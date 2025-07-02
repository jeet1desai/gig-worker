import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse, paginatedResponse } from '@/utils/apiResponse';
import { checkAdminRole } from '@/utils/checkAdminRole';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const roleCheck = await checkAdminRole(req);
  if ('status' in roleCheck) return roleCheck;

  try {
    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get('page');
    const pageSizeParam = searchParams.get('pageSize');
    const sortByParam = searchParams.get('sortBy');
    const orderParam = searchParams.get('order');

    const page = parseInt(pageParam || '1', 10);
    const pageSize = parseInt(pageSizeParam || '10', 10);
    const skip = (page - 1) * pageSize;
    const sortBy = sortByParam || 'created_at';
    const order = orderParam === 'asc' || orderParam === 'desc' ? orderParam : 'desc';

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { is_deleted: false },
        skip,
        take: pageSize,
        orderBy: {
          [sortBy]: order,
        },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          role: true,
          is_banned: true,
          is_verified: true,
          sign_up_type: true,
          created_at: true,
          subscriptions: true,
        },
      }),
      prisma.user.count(),
    ]);

    return paginatedResponse(users, page, pageSize, total, { status: HttpStatusCode.OK });
  } catch (error) {
    console.error('Error fetching paginated users:', error);
    return NextResponse.json(
      errorResponse('Internal Server Error', HttpStatusCode.INTERNAL_SERVER_ERROR),
      {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
