import prisma from '@/lib/prisma';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { errorResponse } from '@/lib/api-response';
import { safeJsonResponse } from '@/utils/apiResponse';

// GET /api/gigs/[id]/similar - Get similar gigs
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const gigId = params.id;

    if (!gigId) {
      return errorResponse({ code: 'BAD_REQUEST', message: 'Gig ID is required', statusCode: HttpStatusCode.BAD_REQUEST });
    }

    const currentGig = await prisma.gig.findUnique({
      where: { id: BigInt(gigId) },
      select: { id: true, keywords: true, tier: true, title: true, description: true, price_range: true }
    });
    if (!currentGig) {
      return errorResponse({ code: 'NOT_FOUND', message: 'Gig not found', statusCode: HttpStatusCode.NOT_FOUND });
    }

    type SearchCondition = { tier?: any; title?: any; description?: any; keywords?: any; AND?: any[] };

    const searchConditions: SearchCondition[] = [];

    const title = currentGig.title?.toLowerCase();
    const description = currentGig.description?.toLowerCase();
    const keywords = Array.isArray(currentGig.keywords) ? currentGig.keywords : [];
    const priceRange = currentGig.price_range as { min?: number; max?: number } | null;

    if (title) {
      searchConditions.push({ title: { contains: title, mode: 'insensitive' as const } });
    }

    if (description) {
      searchConditions.push({ description: { contains: description, mode: 'insensitive' as const } });
    }

    if (keywords.length > 0) {
      searchConditions.push({ keywords: { array_contains: keywords } });
    }

    if (priceRange?.min !== undefined || priceRange?.max !== undefined) {
      const minPrice = priceRange?.min || 0;
      const maxPrice = priceRange?.max || Number.MAX_SAFE_INTEGER;
      searchConditions.push({
        AND: [{ price_range: { path: ['min'], gte: minPrice * 0.8 } }, { price_range: { path: ['max'], lte: maxPrice * 1.2 } }]
      });
    }

    searchConditions.push({ tier: currentGig.tier });

    const similarGigs = await prisma.gig.findMany({
      where: {
        AND: [{ is_removed: false }, { id: { not: BigInt(gigId) } }, { OR: searchConditions }]
      },
      include: {
        user: {
          select: { id: true, first_name: true, last_name: true, email: true, profile_url: true, created_at: true, is_verified: true }
        },
        pipeline: { select: { id: true, status: true } },
        _count: { select: { bids: true } }
      },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    return safeJsonResponse({ success: true, message: 'Gig fetched successfully', data: similarGigs }, { status: HttpStatusCode.OK });
  } catch (error) {
    console.error('Error fetching gig:', error);
    return errorResponse({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch gig', statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
