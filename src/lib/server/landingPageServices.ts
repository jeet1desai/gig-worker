import { safeJson } from '@/lib/utils/safeJson';
import prisma from '@/lib/prisma';
import { PageType } from '@prisma/client';
import { FAQItem, StepItem } from '@/types/fe';
import { string } from 'yup';

export const getLandingPageFAQs = async () => {
  const data = await prisma.cMS.findFirst({
    where: { type: PageType.faqs, isPublished: true },
    select: {
      faqs: true
    }
  });

  const faqs: FAQItem[] = (data && (data.faqs as unknown as FAQItem[])) ?? [];

  const visibleFaqs = Array.isArray(faqs) ? faqs.filter((faq) => faq.isVisible === true) : [];

  return safeJson(visibleFaqs);
};

export const getLandingPageWorkingSteps = async () => {
  const data = await prisma.cMS.findFirst({
    where: { type: PageType.landing, isPublished: true },
    select: {
      steps: true
    }
  });

  const steps: StepItem[] = (data && (data.steps as unknown as StepItem[])) ?? [];

  return safeJson(steps);
};

export const getLandingPageHeroSection = async () => {
  const data = await prisma.cMS.findFirst({
    where: { type: PageType.landing, isPublished: true },
    select: {
      heroSection: true
    }
  });

  const heroSection = data?.heroSection as { title: string; description: string } | null;

  return safeJson(heroSection ?? { title: '', description: '' });
};
