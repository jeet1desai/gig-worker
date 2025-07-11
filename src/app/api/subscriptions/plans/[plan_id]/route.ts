import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { deleteSubscriptionPlan } from '@/lib/paypal/plans';
import { NextResponse } from 'next/server';
import { FREE_PLAN } from '@/constants/plans';
import { deletePlan } from '@/lib/server/subscriptionPlans';

export async function DELETE(
  _request: Request,
  { params }: { params: { plan_id: string } }
) {
  const { plan_id } = await params;

  if (!plan_id) {
    return errorResponse({
      code: 'BAD_REQUEST',
      message: 'Missing Plan Id',
      statusCode: HttpStatusCode.BAD_REQUEST
    });
  }

  try {
    let delete_response;

    if (plan_id !== FREE_PLAN.plan_id) {
      delete_response = await deleteSubscriptionPlan(plan_id);
    }

    if (delete_response || plan_id === FREE_PLAN.plan_id) {
      const delete_message = await deletePlan(plan_id);
      return successResponse({
        data: [],
        message: delete_message
      });
    }
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Unknown error occurred';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
