import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse, safeJsonResponse } from '@/utils/apiResponse';
import { checkAdminRole } from '@/utils/checkAdminRole';

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const roleCheck = await checkAdminRole(request);
  if ('status' in roleCheck) return roleCheck;

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(errorResponse('User ID is required', HttpStatusCode.BAD_REQUEST), { status: HttpStatusCode.BAD_REQUEST });
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json(errorResponse('Invalid user ID', HttpStatusCode.BAD_REQUEST), { status: HttpStatusCode.BAD_REQUEST });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: { id: true, email: true, first_name: true, last_name: true },
    });
    if (!existingUser) {
      return NextResponse.json(errorResponse('User not found', HttpStatusCode.NOT_FOUND), { status: HttpStatusCode.NOT_FOUND });
    }

    await prisma.user.delete({ where: { id: userId } });

    return safeJsonResponse({ success: true, message: 'User deleted successfully', data: existingUser }, { status: HttpStatusCode.OK });
  } catch (error) {
    return NextResponse.json(errorResponse('Internal Server Error', HttpStatusCode.INTERNAL_SERVER_ERROR), {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
}
