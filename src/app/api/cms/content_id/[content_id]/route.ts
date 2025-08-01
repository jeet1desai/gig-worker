import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { cmsPagesServices } from '@/lib/server/cmsPagesServices';
import { CMSPage } from '@/types/fe';

export async function GET(_req: Request, { params }: { params: { content_id: string } }) {
  const { content_id } = await params;
  try {
    const getPageDetailById = await cmsPagesServices.getPageDetailById(content_id);

    return successResponse({
      data: getPageDetailById,
      message: 'Page details fetched successfully'
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch page';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

export async function DELETE(_request: Request, { params }: { params: { content_id: string } }) {
  const { content_id } = await params;

  try {
    const delete_page = await cmsPagesServices.deleteCMSPage(content_id);

    if (delete_page.success && delete_page.message) {
      return successResponse({
        data: [],
        message: delete_page.message
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete page';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

export async function PATCH(request: Request, { params }: { params: { content_id: string } }) {
  const { content_id } = await params;
  const body: Partial<CMSPage> = await request.json();

  try {
    const update_page = await cmsPagesServices.updatePageDetails(content_id, body);

    if (update_page.success && update_page.message) {
      return successResponse({
        data: [],
        message: 'Page details updated successfully'
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update page';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
