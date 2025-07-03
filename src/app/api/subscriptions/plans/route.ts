import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { getPlans } from '@/lib/server/getPlans';

export async function GET(_req: Request) {
  try {
    const plans = await getPlans();

    return successResponse({
      data: plans,
      message: 'Subscription plans fetched successfully',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch subscription plans';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
}
