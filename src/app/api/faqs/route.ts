import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { createFAQ, getFAQs, updateFAQ } from '@/lib/server/faqsLandingPage';
import { FAQsPayload } from '@/types/fe';

export async function GET(_req: Request) {
  try {
    const faqs = await getFAQs();

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

export async function POST(request: Request) {
  try {
    const body: FAQsPayload = await request.json();

    const create_faq: { success: boolean; message: string } = await createFAQ(body);

    if (create_faq.success && create_faq.message) {
      return successResponse({
        data: [],
        message: create_faq.message
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create faq';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const body: FAQsPayload = await request.json();

    const update_faq: { success: boolean; message: string } = await updateFAQ(
      body,
      (body.id && body.id) || ''
    );

    if (update_faq.success && update_faq.message) {
      return successResponse({
        data: [],
        message: update_faq.message
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update faq';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
