import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { changeWorkingStepOrder, deleteWorkingStep } from '@/lib/server/workignStepsLandingPage';
import { WorkingStepDirectionType } from '@/types/fe';

export async function DELETE(_request: Request, { params }: { params: { step_id: string } }) {
  const { step_id } = await params;

  if (!step_id) {
    return errorResponse({
      code: 'BAD_REQUEST',
      message: 'Missing Step Id',
      statusCode: HttpStatusCode.BAD_REQUEST
    });
  }

  try {
    const delete_step: { success: boolean; message: string } = await deleteWorkingStep(step_id);

    if (delete_step.success && delete_step.message) {
      return successResponse({
        data: [],
        message: delete_step.message
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete step';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

export async function PATCH(request: Request, { params }: { params: { step_id: string } }) {
  const body: { direction: WorkingStepDirectionType } = await request.json();

  const { step_id } = await params;

  if (!step_id) {
    return errorResponse({
      code: 'BAD_REQUEST',
      message: 'Missing Step Id',
      statusCode: HttpStatusCode.BAD_REQUEST
    });
  }

  try {
    const change_order: { success: boolean; message: string } = await changeWorkingStepOrder(step_id, body.direction);

    if (change_order.success && change_order.message) {
      return successResponse({
        data: [],
        message: change_order.message
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete step';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
