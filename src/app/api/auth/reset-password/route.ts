import { ValidationError } from 'yup'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

import prisma from '@/lib/prisma'
import { resetPasswordSchema } from '@/schemas/be/auth'
import { errorResponse, successResponse } from '@/lib/api-response'
import { HttpStatusCode } from '@/enums/shared/http-status-code'
import { verifyEmailVerificationToken } from '@/lib/tokens'

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { password } = await resetPasswordSchema.validate(body, {
      abortEarly: false
    })
    const token = body.token
    if (!token) {
      return errorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Reset token is missing or expired.',
        statusCode: HttpStatusCode.BAD_REQUEST,
        fieldErrors: { token: 'Reset token is required.' }
      })
    }

    let payload: { userId: string }
    try {
      payload = verifyEmailVerificationToken(token)
    } catch {
      return errorResponse({
        code: 'INVALID_TOKEN',
        message: 'Reset password link is invalid or expired.',
        statusCode: HttpStatusCode.BAD_REQUEST
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.userId) }
    })

    if (!user) {
      return errorResponse({
        code: 'USER_NOT_FOUND',
        message: 'User not found.',
        statusCode: HttpStatusCode.NOT_FOUND
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    return successResponse({
      data: null,
      message: 'Password has been reset successfully.',
      statusCode: HttpStatusCode.OK
    })
  } catch (err) {
    if (err instanceof ValidationError) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of err.inner) {
        if (issue.path) fieldErrors[issue.path] = issue.message
        else fieldErrors[''] = issue.message
      }

      return errorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload',
        statusCode: HttpStatusCode.BAD_REQUEST,
        fieldErrors
      })
    }

    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong while processing your request.',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      details: err instanceof Error ? err.message : 'Unknown error'
    })
  }
}
