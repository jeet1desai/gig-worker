import { NextResponse } from 'next/server'

import { ApiResponse } from '@/types/shared/api-response'

export function successResponse<T, S = undefined>({
  data,
  message,
  statusCode = 200,
  meta
}: {
  data: T
  message?: string
  statusCode?: number
  meta?: S
}): NextResponse<ApiResponse<T, S>> {
  const response: ApiResponse<T, S> = {
    success: true,
    data,
    message,
    ...(meta && { meta })
  }

  return NextResponse.json<ApiResponse<T, S>>(response, {
    status: statusCode
  })
}

export function errorResponse({
  code,
  message,
  statusCode = 400,
  details,
  fieldErrors
}: {
  code: string
  message: string
  statusCode?: number
  details?: string | string[]
  fieldErrors?: Record<string, string>
}): NextResponse<ApiResponse<null>> {
  const response: ApiResponse<null> = {
    success: false,
    error: {
      code,
      message,
      details,
      fieldErrors
    }
  }

  return NextResponse.json<ApiResponse<null>>(response, {
    status: statusCode
  })
}
