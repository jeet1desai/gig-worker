import { NextRequest } from 'next/server'

import prisma from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-response'
import { HttpStatusCode } from '@/enums/shared/http-status-code'
import { safeJson } from '@/lib/utils/safeJson'
import { verifyEmailVerificationToken } from '@/lib/tokens'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return errorResponse(
      'TOKEN_MISSING',
      'Verification token is missing.',
      HttpStatusCode.BAD_REQUEST,
    )
  }

  try {
    const { userId } = verifyEmailVerificationToken(token)

    const user = await prisma.user.findUnique({ where: { id: BigInt(userId) } })

    if (!user) {
      return errorResponse(
        'USER_NOT_FOUND',
        'No user found for the provided token.',
        HttpStatusCode.NOT_FOUND,
      )
    }

    if (user.is_verified) {
      return successResponse(null, 'User already verified.')
    }

    const updatedUser = await prisma.user.update({
      where: { id: BigInt(userId) },
      data: { is_verified: true },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
      },
    })

    return successResponse(safeJson(updatedUser), 'Email verified successfully.')
  } catch (err) {
    return errorResponse(
      'INVALID_OR_EXPIRED_TOKEN',
      'Verification token is invalid or has expired.',
      HttpStatusCode.UNAUTHORIZED,
      {
        details: err instanceof Error ? err.message : 'Unknown error',
      },
    )
  }
}
