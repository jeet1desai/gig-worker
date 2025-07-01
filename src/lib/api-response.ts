import { NextResponse } from 'next/server';

import { ApiResponse } from '@/types/shared/api-response';

export function successResponse<T, S>(
  data: T,
  message?: string,
  status = 200,
  meta?: S,
): NextResponse<ApiResponse<T, S>> {
  const response: ApiResponse<T, S> = {
    success: true,
    data,
    message,
    ...(meta && { meta }),
  };

  return NextResponse.json<ApiResponse<T, S>>(response, {
    status,
  });
}

export function errorResponse(
  code: string,
  message: string,
  statusCode = 400,
  options?: {
    details?: string | string[];
    fieldErrors?: Record<string, string>;
  },
): NextResponse<ApiResponse<null>> {
  const response: ApiResponse<null> = {
    success: false,
    error: {
      code,
      message,
      details: options?.details,
      fieldErrors: options?.fieldErrors,
    },
  };

  return NextResponse.json<ApiResponse<null>>(response, {
    status: statusCode,
  });
}
