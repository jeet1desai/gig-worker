import prisma from '@/lib/prisma';
import { errorResponse, safeJsonResponse } from '@/utils/apiResponse';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { TIER } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const gigId = params.id;
    if (!gigId) {
      return errorResponse('Gig ID is required', HttpStatusCode.BAD_REQUEST);
    }

    const gig = await prisma.gig.findUnique({
      where: { 
        id: BigInt(gigId)
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_url: true,
            email: true,
            created_at: true,
            is_verified: true
          }
        },
        review_rating: true,
        Testimonials: {
          include: {
            provider: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                profile_url: true
              }
            },
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                profile_url: true
              }
            }
          },
          take: 5 
        }
      }
    });

    if (!gig) {
      return errorResponse('Gig not found', HttpStatusCode.NOT_FOUND);
    }

    const responseData = {
      id: gig.id.toString(),
      title: gig.title,
      description: gig.description,
      price_range: gig.price_range,
      tier: gig.tier,
      thumbnail: gig.thumbnail,
      attachments: gig.attachments,
      keywords: gig.keywords,
      start_date: gig.start_date,
      end_date: gig.end_date,
      created_at: gig.created_at,
      updated_at: gig.updated_at,
      location: gig.location,
      user: gig.user,
      review_rating: gig.review_rating,
      testimonials: gig.Testimonials
    };

    return safeJsonResponse(
      {
        success: true,
        message: 'Gig details fetched successfully',
        data: responseData
      },
      { status: HttpStatusCode.OK }
    );
  } catch (error) {
    console.error('Error fetching gig details:', error);
    return errorResponse(
      'Failed to fetch gig details', 
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    );
  }
}
