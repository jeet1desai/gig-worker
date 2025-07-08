import { checkAdminRole } from '@/utils/checkAdminRole';
import { NextResponse } from 'next/server';
import { errorResponse, safeJsonResponse } from '@/utils/apiResponse';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: RouteParams) {
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

    const body = await request.json();
    const { is_verified } = body;

    if (typeof is_verified !== 'boolean') {
      return NextResponse.json(errorResponse('Invalid verification status. Expected a boolean value.', HttpStatusCode.BAD_REQUEST), {
        status: HttpStatusCode.BAD_REQUEST,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: BigInt(userId) },
      data: { is_verified },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        is_verified: true,
      },
    });

    return safeJsonResponse(
      {
        success: true,
        message: `User ${is_verified ? 'verified' : 'unverified'} successfully`,
        data: { ...updatedUser, id: updatedUser.id.toString() },
      },
      { status: HttpStatusCode.OK },
    );
  } catch (error) {
    console.error('Error updating user verification status:', error);
    return NextResponse.json(errorResponse('Failed to update user verification status', HttpStatusCode.INTERNAL_SERVER_ERROR), {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
}
