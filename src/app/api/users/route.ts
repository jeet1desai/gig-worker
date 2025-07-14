import { NextResponse } from 'next/server';
import { Prisma, ROLE } from '@prisma/client';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse, paginatedResponse, safeJsonResponse } from '@/utils/apiResponse';
import { checkAdminRole } from '@/utils/checkAdminRole';
import * as yup from 'yup';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const createUserSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character'),
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  role: yup.string().oneOf(Object.values(ROLE)).default(ROLE.user),
  profileUrl: yup.string().url('Invalid URL format').optional(),
  signUpType: yup.string().optional(),
  bio: yup.string().optional(),
  bannerUrl: yup.string().url('Invalid banner URL format').optional(),
  interests: yup.array().of(yup.string()).optional(),
  extracurricular: yup.array().of(yup.string()).optional(),
  certifications: yup.array().of(yup.string()).optional(),
  skills: yup.array().of(yup.string()).optional(),
  educations: yup.array().of(yup.string()).optional(),
  badges: yup.array().of(yup.string()).optional()
});

export async function POST(req: Request) {
  const roleCheck = await checkAdminRole(req);
  if ('status' in roleCheck) return roleCheck;

  try {
    const body = await req.json();

    try {
      await createUserSchema.validate(body, { abortEarly: false });
    } catch (validationError: any) {
      const errors = validationError.inner.map((err: any) => ({
        field: err.path,
        message: err.message
      }));
      return NextResponse.json(
        errorResponse('Validation failed', HttpStatusCode.BAD_REQUEST, { errors }),
        { status: HttpStatusCode.BAD_REQUEST }
      );
    }

    const {
      email,
      password,
      firstName,
      lastName,
      role,
      profileUrl = '',
      signUpType = 'manual',
      bio = '',
      bannerUrl = '',
      interests = [],
      extracurricular = [],
      certifications = [],
      skills = [],
      educations = [],
      badges = []
    } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        errorResponse('User with this email already exists', HttpStatusCode.CONFLICT),
        { status: HttpStatusCode.CONFLICT }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [user, profile] = await prisma.$transaction([
      prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          role: role || ROLE.user,
          profile_url: profileUrl,
          sign_up_type: signUpType,
          is_verified: true,
          is_banned: false
        },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          role: true,
          is_verified: true,
          is_banned: true,
          created_at: true
        }
      }),
      prisma.userProfile.create({
        data: {
          bio,
          banner_url: bannerUrl,
          interests,
          extracurricular,
          certifications,
          skills,
          educations,
          badges,
          user: {
            connect: {
              email: email
            }
          }
        },
        select: {
          bio: true,
          banner_url: true,
          interests: true,
          extracurricular: true,
          certifications: true,
          skills: true,
          educations: true,
          badges: true
        }
      })
    ]);

    return safeJsonResponse(
      {
        success: true,
        message: 'User and profile created successfully',
        data: { ...user, ...profile }
      },
      { status: HttpStatusCode.CREATED }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      errorResponse('Internal Server Error', HttpStatusCode.INTERNAL_SERVER_ERROR),
      {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR
      }
    );
  }
}

export async function GET(req: Request) {
  const roleCheck = await checkAdminRole(req);
  if ('status' in roleCheck) return roleCheck;

  try {
    const { searchParams } = new URL(req.url);
    const searchParam = searchParams.get('search');
    const pageParam = searchParams.get('page');
    const pageSizeParam = searchParams.get('pageSize');
    const sortByParam = searchParams.get('sortBy');
    const orderParam = searchParams.get('order');

    const page = parseInt(pageParam || '1', 10);
    const pageSize = parseInt(pageSizeParam || '10', 10);
    const skip = (page - 1) * pageSize;
    const sortBy = sortByParam || 'created_at';
    const order = orderParam === 'asc' || orderParam === 'desc' ? orderParam : 'desc';

    const whereClause = {
      is_deleted: false,
      ...(searchParam && {
        OR: [
          { email: { contains: searchParam, mode: Prisma.QueryMode.insensitive } },
          { first_name: { contains: searchParam, mode: Prisma.QueryMode.insensitive } },
          { last_name: { contains: searchParam, mode: Prisma.QueryMode.insensitive } }
        ]
      })
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy: {
          [sortBy]: order
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
          subscriptions: true
        }
      }),
      prisma.user.count({ where: whereClause })
    ]);

    return paginatedResponse(users, page, pageSize, total, { status: HttpStatusCode.OK });
  } catch (error) {
    console.error('Error fetching paginated users:', error);
    return NextResponse.json(
      errorResponse('Internal Server Error', HttpStatusCode.INTERNAL_SERVER_ERROR),
      {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR
      }
    );
  }
}
