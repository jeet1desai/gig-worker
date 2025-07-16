import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { WorkingStepPayload } from '@/types/fe';
import { createWorkingStep, getWorkingSteps, updateWorkingStep } from '@/lib/server/workignStepsLandingPage';

export async function GET(_req: Request) {
  try {
    const steps = await getWorkingSteps();

    return successResponse({
      data: steps,
      message: 'Working steps fetched successfully'
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch working steps';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

export async function POST(request: Request) {
  try {
    const body: WorkingStepPayload = await request.json();

    const create_step: { success: boolean; message: string } = await createWorkingStep(body);

    if (create_step.success && create_step.message) {
      return successResponse({
        data: [],
        message: create_step.message
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create working step';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const body: WorkingStepPayload = await request.json();

    const update_steps: { success: boolean; message: string } = await updateWorkingStep(body, (body.id && body.id) || '');

    if (update_steps.success && update_steps.message) {
      return successResponse({
        data: [],
        message: update_steps.message
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update working step';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
