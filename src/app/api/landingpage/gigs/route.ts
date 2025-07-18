import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { getLandingPageGigs } from '@/lib/server/landingPageServices';

export async function GET(_req: Request) {
  try {
    const gigs = await getLandingPageGigs();

    return successResponse({
      data: gigs,
      message: 'Gigs fetched successfully'
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch gigs';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
