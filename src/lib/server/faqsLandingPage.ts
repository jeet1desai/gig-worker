import { FAQsPayload } from '@/types/fe';
import { safeJson } from '@/lib/utils/safeJson';
import prisma from '@/lib/prisma';

export const getFAQs = async () => {
  const faqs = await prisma.fAQs.findMany({
    orderBy: { id: 'asc' }
  });

  return safeJson(faqs);
};

export const createFAQ = async (faq_details: FAQsPayload) => {
  await prisma.fAQs.create({
    data: {
      question: faq_details.question,
      answer: faq_details.answer
    }
  });
  return { success: true, message: 'The FAQ has been successfully created.' };
};

export const updateFAQ = async (faq_details: FAQsPayload, faq_id: string) => {
  await prisma.fAQs.update({
    where: { id: BigInt(faq_id) },
    data: {
      question: faq_details.question,
      answer: faq_details.answer
    }
  });
  return { success: true, message: 'The FAQ has been successfully updated.' };
};

export const deleteFAQ = async (faq_id: string) => {
  await prisma.fAQs.delete({
    where: { id: BigInt(faq_id) }
  });

  return { success: true, message: 'The FAQ has been successfully deleted.' };
};
