import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { getLandingPageWorkingSteps } from '@/lib/server/landingPageServices';

export async function GET(_req: Request) {
  try {
    const faqs = await getLandingPageWorkingSteps();

    return successResponse({
      data: faqs,
      message: 'Working steps fetched successfully'
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch working steps';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
