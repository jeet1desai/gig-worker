import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { contentService } from '@/lib/server/contentService';

export async function GET(_request: Request, { params }: { params: { type: string } }) {
  const { type } = await params;

  try {
    const all_content = await contentService.getContentByType(type);

    return successResponse({
      data: all_content,
      message: 'Content data fetched successfully'
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch content';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
