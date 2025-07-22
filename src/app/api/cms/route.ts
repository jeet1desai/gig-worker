import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { contentService } from '@/lib/server/contentService';
import { ContentItem, WorkingStepDirectionType } from '@/types/fe';

export async function POST(request: Request) {
  try {
    const body: ContentItem = await request.json();

    const create_content: { success: boolean; message: string } = await contentService.createContent(body);

    if (create_content.success && create_content.message) {
      return successResponse({
        data: [],
        message: create_content.message
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create content';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

export async function PATCH(request: Request) {
  const body: { id: string; direction: WorkingStepDirectionType } = await request.json();

  try {
    const update_order = await contentService.reorderContent(body);

    if (update_order.success && update_order.message) {
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
