import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { errorResponse, successResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import prisma from '@/lib/prisma';
import { safeJson } from '@/lib/utils/safeJson';
import moment from 'moment';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return errorResponse({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to view your gigs',
        statusCode: HttpStatusCode.UNAUTHORIZED
      });
    }

    const gigs: any = await prisma.$queryRaw`SELECT
        "Gig".id,
        "Gig".title,
        "Gig".start_date,
        "Gig".end_date,
        "Gig".tier,
        "GigPipeline".status AS pipeline_status,
        COALESCE(SUM("ProviderEarning".amount), 0) AS total_earnings,
        DATE_PART('day', "Gig".end_date - "Gig".start_date) AS duration_in_days
      FROM "Gig"
      LEFT JOIN "GigPipeline" ON "GigPipeline".gig_id = "Gig".id
      LEFT JOIN "ProviderEarning" ON "ProviderEarning".gig_id = "Gig".id
      WHERE "Gig".user_id = ${BigInt(session.user.id)}
        AND "Gig".is_removed = false
      GROUP BY
        "Gig".id,
        "Gig".title,
        "Gig".start_date,
        "Gig".end_date,
        "Gig".tier,
        "GigPipeline".status
      ORDER BY "Gig".created_at DESC
      LIMIT 5;`;

    return successResponse({
      data: {
        gigs: safeJson(gigs)
      },
      message: 'Gigs fetched successfully',
      statusCode: HttpStatusCode.OK
    });
  } catch (error) {
    console.error('Error fetching user gigs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch your gigs';
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: errorMessage,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}
