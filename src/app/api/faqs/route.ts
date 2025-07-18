import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { getLandingPageFAQs } from '@/lib/server/landingPageServices';

export async function GET(_req: Request) {
  try {
    const faqs = await getLandingPageFAQs();

    return successResponse({
      data: faqs,
      message: 'FAQs fetched successfully'
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch faqs';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
