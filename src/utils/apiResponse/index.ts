import { NextResponse } from 'next/server';

export function safeJsonResponse(data: any, init?: ResponseInit) {
  return NextResponse.json(JSON.parse(JSON.stringify(data, (_key, value) => (typeof value === 'bigint' ? value.toString() : value))), init);
}

export function errorResponse<T>(message: string, statusCode: number, data: T = {} as T) {
  return {
    status: statusCode,
    success: false,
    message,
    data
  };
}

export function paginatedResponse<T>(items: T[], page: number, pageSize: number, total: number, init?: ResponseInit) {
  const result = {
    items,
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };

  return safeJsonResponse(result, init);
}
