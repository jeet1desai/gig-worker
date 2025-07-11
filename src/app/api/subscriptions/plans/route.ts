import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import {
  createSubscriptionPlan,
  updateSubscriptionPlanDetails
} from '@/lib/paypal/plans';
import { SubscriptionPlanPayload } from '@/types/fe';
import lodash from 'lodash';
import { FREE_PLAN, FREE_PLAN_ID } from '@/constants/plans';
import { createPlan, getPlans, updatePlan } from '@/lib/server/subscriptionPlans';
import { SUBSCRIPTION_TYPE } from '@prisma/client';

export async function GET(_req: Request) {
  try {
    const plans = await getPlans();

    return successResponse({
      data: plans,
      message: 'Subscription plans fetched successfully'
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to fetch subscription plans';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

export async function POST(request: Request) {
  try {
    const body: SubscriptionPlanPayload = await request.json();
    if (body.subscriptionType === SUBSCRIPTION_TYPE.free) {
      const create_success_message = await createPlan(body, FREE_PLAN_ID);
      return successResponse({
        data: [],
        message: create_success_message
      });
    }
    const create_plan: { [key: string]: any } = await createSubscriptionPlan(body);

    if (create_plan.data && create_plan.message) {
      const create_success_message = await createPlan(body, create_plan.data.id);
      return successResponse({
        data: create_plan.data,
        message: create_success_message
      });
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to create subscription plans';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const existing = body.old_data;
    const updated = body.updated_data;
    const plan_id = existing.plan_id;

    const patchPayload: { op: string; path: string; value: string }[] = [];

    const nameChanged = !lodash.isEqual(existing.name, updated.name);
    const descriptionChanged = !lodash.isEqual(existing.description, updated.description);

    if (nameChanged) {
      patchPayload.push({ op: 'replace', path: '/name', value: updated.name });
    }

    if (descriptionChanged) {
      patchPayload.push({
        op: 'replace',
        path: '/description',
        value: updated.description
      });
    }

    const nameOrDescriptionChanged = patchPayload.length > 0;

    let update_plan_details = false;

    if (nameOrDescriptionChanged && plan_id !== FREE_PLAN.plan_id) {
      update_plan_details = await updateSubscriptionPlanDetails(plan_id, patchPayload);
    }

    if (!nameOrDescriptionChanged || plan_id === FREE_PLAN.plan_id) {
      const update_success_message = await updatePlan(plan_id, updated);
      return successResponse({
        data: [],
        message: update_success_message
      });
    }

    if (update_plan_details) {
      const update_success_message = await updatePlan(plan_id, updated);
      return successResponse({
        data: [],
        message: update_success_message
      });
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to update subscription plans';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
