import { safeJson } from '@/lib/utils/safeJson';
import prisma from '@/lib/prisma';
import { formatDistanceToNow, differenceInDays } from 'date-fns';

type PriceRange = {
  min: number;
  max: number;
};

function isPriceRange(obj: any): obj is PriceRange {
  return obj && typeof obj === 'object' && typeof obj.min === 'number' && typeof obj.max === 'number';
}

function formatDuration(start: Date, end: Date): string {
  const totalDays = differenceInDays(end, start);

  if (totalDays < 30) {
    return `${totalDays} ${totalDays === 1 ? 'Day' : 'Days'}`;
  }

  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);

  let duration = '';
  if (years > 0) duration += `${years} ${years === 1 ? 'Year' : 'Years'}`;
  if (months > 0) {
    duration += years > 0 ? ' ' : '';
    duration += `${months} ${months === 1 ? 'Month' : 'Months'}`;
  }

  return duration || 'Flexible';
}

export const getLandingPageFAQs = async () => {
  const faqs = await prisma.cMS.findMany({
    where: { type: 'faq', isVisible: true },
    orderBy: { order: 'asc' }
  });

  return safeJson(faqs);
};

export const getLandingPageGigs = async () => {
  const gigs = await prisma.gig.findMany({
    where: {
      OR: [{ end_date: null }, { end_date: { gt: new Date() } }]
    },
    orderBy: {
      created_at: 'desc'
    },
    take: 6,
    include: {
      user: {
        select: {
          first_name: true,
          last_name: true,
          profile_url: true
        }
      }
    }
  });

  const formattedGigs = gigs.map((gig) => {
    const priceRange = gig.price_range;
    let price = '$ N/A';

    if (isPriceRange(priceRange)) {
      price = `$ ${priceRange.min} - ${priceRange.max}`;
    }

    let duration = 'Flexible';
    if (gig.start_date && gig.end_date) {
      duration = formatDuration(new Date(gig.start_date), new Date(gig.end_date));
    }

    return {
      title: gig.title,
      price,
      duration,
      provider: gig.user?.first_name && gig.user?.last_name ? `${gig.user.first_name} ${gig.user.last_name}` : 'Unknown',
      postTime: `Posted ${formatDistanceToNow(new Date(gig.created_at))} ago`,
      description: gig.description?.slice(0, 100) ?? '',
      profile_url: gig.user?.profile_url ?? '',
      place: 'N/A'
    };
  });

  return safeJson(formattedGigs);
};
