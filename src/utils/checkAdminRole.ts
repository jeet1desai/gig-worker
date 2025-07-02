import jwt from 'jsonwebtoken';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse } from '@/utils/apiResponse';
import { NextResponse } from 'next/server';

export async function checkAdminRole(req: Request): Promise<NextResponse | { isValid: true }> {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json(errorResponse('Unauthorized: No token provided', HttpStatusCode.UNAUTHORIZED), {
      status: HttpStatusCode.UNAUTHORIZED,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET as string) as { role: string };

    if (decoded.role !== 'admin') {
      return NextResponse.json(errorResponse('Forbidden: Admins only', HttpStatusCode.FORBIDDEN), {
        status: HttpStatusCode.FORBIDDEN,
      });
    }

    return { isValid: true };
  } catch (err) {
    return NextResponse.json(errorResponse('Invalid or expired token', HttpStatusCode.UNAUTHORIZED), {
      status: HttpStatusCode.UNAUTHORIZED,
    });
  }
}
