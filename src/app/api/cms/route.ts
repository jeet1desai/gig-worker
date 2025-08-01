import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { CMSPage } from '@/types/fe';
import { cmsPagesServices } from '@/lib/server/cmsPagesServices';
import { paginatedResponse } from '@/utils/apiResponse';

export async function GET(req: Request) {
  try {
    const getAllPages = await cmsPagesServices.getAllPagesList(req);

    return paginatedResponse(getAllPages.pages, getAllPages.page as number, getAllPages.pageSize as number, getAllPages.total, {
      status: HttpStatusCode.OK
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch pages';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

export async function POST(request: Request) {
  try {
    const body: CMSPage = await request.json();

    const create_page: { success: boolean; message: string } = await cmsPagesServices.createCMSPage(body);

    if (create_page.success && create_page.message) {
      return successResponse({
        data: [],
        message: create_page.message
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create page';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
