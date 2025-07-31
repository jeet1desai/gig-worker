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

    const gigs = await prisma.gig.findMany({
      where: { user_id: BigInt(session.user.id), is_removed: false },
      take: 5,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        start_date: true,
        end_date: true,
        tier: true,
        pipeline: {
          select: { status: true }
        },
        provider_earnings: {
          select: { amount: true }
        }
      }
    });

    const gigsWithUpdated = gigs.map(({ provider_earnings, ...gig }) => {
      const totalEarnings = provider_earnings.reduce((sum, earning) => {
        return sum + parseFloat(earning.amount.toString());
      }, 0);
      const start = moment(gig.start_date);
      const end = moment(gig.end_date);
      const durationInDays = end.diff(start, 'days');

      return {
        ...gig,
        days: durationInDays,
        total_earnings: totalEarnings
      };
    });
    return successResponse({
      data: {
        gigs: safeJson(gigsWithUpdated)
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
