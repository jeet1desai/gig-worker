import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { deleteFAQ } from '@/lib/server/faqsLandingPage';

export async function DELETE(
  _request: Request,
  { params }: { params: { faq_id: string } }
) {
  const { faq_id } = await params;

  if (!faq_id) {
    return errorResponse({
      code: 'BAD_REQUEST',
      message: 'Missing FAQ Id',
      statusCode: HttpStatusCode.BAD_REQUEST
    });
  }

  try {
    const delete_faq: { success: boolean; message: string } = await deleteFAQ(faq_id);

    if (delete_faq.success && delete_faq.message) {
      return successResponse({
        data: [],
        message: delete_faq.message
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete faq';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
