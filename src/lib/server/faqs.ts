import { safeJson } from '@/lib/utils/safeJson';
import prisma from '@/lib/prisma';

export const getLandingPage = async () => {
  const faqs = await prisma.cMS.findMany({
    where: { type: 'faq', isVisible: true },
    orderBy: { order: 'asc' }
  });

  return safeJson(faqs);
};
