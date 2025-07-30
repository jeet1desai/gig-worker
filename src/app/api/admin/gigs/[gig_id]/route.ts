import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse, successResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { safeJsonResponse } from '@/utils/apiResponse';
import { checkAdminRole } from '@/utils/checkAdminRole';
import { GIG_STATUS } from '@prisma/client';

export async function GET(request: Request, { params }: { params: { gig_id: string } }) {
  const roleCheck = await checkAdminRole(request);
  if ('status' in roleCheck) return roleCheck;

  const { gig_id } = await params;

  if (!gig_id) {
    return errorResponse({
      code: 'BAD_REQUEST',
      message: 'Missing Gig Id',
      statusCode: HttpStatusCode.BAD_REQUEST
    });
  }

  try {
    let gig_details = await prisma.gig.findFirst({
      where: { id: BigInt(gig_id) },
      select: {
        attachments: true,
        completed_at: true,
        created_at: true,
        description: true,
        end_date: true,
        id: true,
        is_removed: true,
        keywords: true,
        location: true,
        pipeline: true,
        price_range: true,
        start_date: true,
        thumbnail: true,
        tier: true,
        title: true,
        updated_at: true,
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            profile_url: true,
            created_at: true,
            _count: {
              select: {
                gigs: true
              }
            }
          }
        },
        user_id: true
      }
    });

    if (!gig_details) {
      return errorResponse({
        code: 'NOT_FOUND',
        message: 'Gig details not available.',
        statusCode: HttpStatusCode.NOT_FOUND
      });
    }

    return safeJsonResponse(
      {
        success: true,
        message: 'Gig details fetched successfully',
        data: gig_details
      },
      { status: HttpStatusCode.OK }
    );
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Unknown error occurred';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

export async function DELETE(request: Request, { params }: { params: { gig_id: string } }) {
  const roleCheck = await checkAdminRole(request);
  if ('status' in roleCheck) return roleCheck;

  const { gig_id } = await params;

  if (!gig_id) {
    return errorResponse({
      code: 'BAD_REQUEST',
      message: 'Missing Gig Id',
      statusCode: HttpStatusCode.BAD_REQUEST
    });
  }

  try {
    let is_gig_available = await prisma.gig.findFirst({
      where: { id: BigInt(gig_id), is_removed: false }
    });

    if (!is_gig_available) {
      return errorResponse({
        code: 'NOT_FOUND',
        message: 'Gig details not available.',
        statusCode: HttpStatusCode.NOT_FOUND
      });
    }

    let delete_gig = await prisma.gig.update({
      where: { id: BigInt(gig_id) },
      data: {
        is_removed: true
      }
    });

    return safeJsonResponse(
      {
        success: true,
        message: 'Gig deleted successfully',
        data: delete_gig
      },
      { status: HttpStatusCode.OK }
    );
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Unknown error occurred';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

export async function PATCH(request: Request, { params }: { params: { gig_id: string } }) {
  const roleCheck = await checkAdminRole(request);
  if ('status' in roleCheck) return roleCheck;

  const { gig_id } = params;

  if (!gig_id) {
    return errorResponse({
      code: 'BAD_REQUEST',
      message: 'Missing Gig Id',
      statusCode: HttpStatusCode.BAD_REQUEST
    });
  }

  let body: { status?: GIG_STATUS };
  try {
    body = await request.json();
  } catch {
    return errorResponse({
      code: 'BAD_REQUEST',
      message: 'Invalid JSON body',
      statusCode: HttpStatusCode.BAD_REQUEST
    });
  }

  const { status } = body;

  if (!status) {
    return errorResponse({
      code: 'BAD_REQUEST',
      message: 'Missing pipeline status',
      statusCode: HttpStatusCode.BAD_REQUEST
    });
  }

  try {
    const gig = await prisma.gig.findUnique({
      where: { id: BigInt(gig_id), is_removed: false }
    });

    if (!gig) {
      return errorResponse({
        code: 'NOT_FOUND',
        message: 'Gig not found',
        statusCode: HttpStatusCode.NOT_FOUND
      });
    }

    await prisma.gigPipeline.update({
      where: { gig_id: BigInt(gig_id) },
      data: { status: status as GIG_STATUS }
    });

    const updatedGig = await prisma.gig.findUnique({
      where: { id: BigInt(gig_id) },
      select: {
        id: true,
        title: true,
        description: true,
        start_date: true,
        end_date: true,
        tier: true,
        price_range: true,
        keywords: true,
        completed_at: true,
        thumbnail: true,
        attachments: true,
        location: true,
        is_removed: true,
        created_at: true,
        updated_at: true,
        user_id: true,
        pipeline: {
          select: {
            id: true,
            status: true,
            created_at: true,
            updated_at: true
          }
        },
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            profile_url: true,
            created_at: true,
            _count: {
              select: {
                gigs: true
              }
            }
          }
        }
      }
    });

    return safeJsonResponse(
      {
        success: true,
        message: 'Pipeline status updated successfully.',
        data: updatedGig
      },
      { status: HttpStatusCode.OK }
    );
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Unknown error occurred';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
