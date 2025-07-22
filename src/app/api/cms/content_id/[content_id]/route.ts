import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { contentService } from '@/lib/server/contentService';
import { ContentItem } from '@/types/fe';

export async function DELETE(_request: Request, { params }: { params: { content_id: string } }) {
  const { content_id } = await params;

  try {
    const delete_content = await contentService.deleteContent(content_id);

    if (delete_content.success && delete_content.message) {
      return successResponse({
        data: [],
        message: 'Content data deleted successfully'
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete content';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

export async function PATCH(request: Request, { params }: { params: { content_id: string } }) {
  const { content_id } = await params;
  const body: Partial<ContentItem> = await request.json();

  try {
    const update_content = await contentService.updateContent(content_id, body);

    if (update_content.success && update_content.message) {
      return successResponse({
        data: [],
        message: 'Content data updated successfully'
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update content';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
