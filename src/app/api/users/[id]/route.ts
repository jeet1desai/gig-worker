import { NextResponse } from 'next/server';
import { PrismaClient, User, UserProfile, UserBan, Subscription } from '@prisma/client';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse, safeJsonResponse } from '@/utils/apiResponse';
import { checkAdminRole } from '@/utils/checkAdminRole';

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    id: string;
  };
}

type UserWithRelations = User & {
  profile: UserProfile | null;
  user_ban: UserBan | null;
  subscriptions: Subscription[];
};

type TransformedUser = Omit<User, 'id'> & {
  id: string;
  profile: (Omit<UserProfile, 'id' | 'user_id'> & { id: string; user_id: string }) | null;
  user_ban: (Omit<UserBan, 'id' | 'user_id'> & { id: string; user_id: string }) | null;
  subscriptions: Array<
    Omit<Subscription, 'id' | 'user_id' | 'plan_id'> & {
      id: string;
      user_id: string;
      plan_id: string;
    }
  >;
};

export async function GET(request: Request, { params }: RouteParams) {
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

    const existingUser = (await prisma.user.findUnique({
      where: { id: BigInt(userId) },
      include: {
        profile: true,
        user_ban: true,
        subscriptions: true,
      },
    })) as UserWithRelations | null;

    if (!existingUser) {
      return NextResponse.json(errorResponse('User not found', HttpStatusCode.NOT_FOUND), { status: HttpStatusCode.NOT_FOUND });
    }

    const { password, ...userWithoutPassword } = existingUser;

    const userData: TransformedUser | any = {
      ...userWithoutPassword,
      id: existingUser.id.toString(),
      profile: existingUser.profile
        ? {
            ...existingUser.profile,
            id: existingUser.profile.id.toString(),
            user_id: existingUser.profile.user_id.toString(),
          }
        : null,
      user_ban: existingUser.user_ban
        ? {
            ...existingUser.user_ban,
            id: existingUser.user_ban.id.toString(),
            user_id: existingUser.user_ban.user_id.toString(),
          }
        : null,
      subscriptions: existingUser.subscriptions.map((sub) => ({
        ...sub,
        id: sub.id.toString(),
        user_id: sub.user_id.toString(),
        plan_id: sub.plan_id.toString(),
      })),
    };

    return safeJsonResponse(
      {
        success: true,
        message: 'User fetched successfully',
        data: userData,
      },
      { status: HttpStatusCode.OK },
    );
  } catch (error) {
    return NextResponse.json(errorResponse('Internal Server Error', HttpStatusCode.INTERNAL_SERVER_ERROR), {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
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
    const { first_name, last_name } = body;

    const updateData: { first_name?: string; last_name?: string } = {
      first_name: first_name?.trim(),
      last_name: last_name?.trim(),
    };

    const updatedUser = await prisma.user.update({
      where: { id: BigInt(userId) },
      data: updateData,
      select: { id: true, email: true, first_name: true, last_name: true },
    });

    return safeJsonResponse(
      {
        success: true,
        message: 'User profile updated successfully',
        data: { ...updatedUser, id: updatedUser.id.toString() },
      },
      { status: HttpStatusCode.OK },
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(errorResponse('Failed to update user profile', HttpStatusCode.INTERNAL_SERVER_ERROR), {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
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
