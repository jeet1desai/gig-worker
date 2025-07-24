import prisma from '@/lib/prisma';
import { CMSPage } from '@/types/fe';
import { PageType, Prisma } from '@prisma/client';
import { safeJson } from '../utils/safeJson';

export const cmsPagesServices = {
  async getAllFooterContent() {
    const findManyOptions = await prisma.cMS.findMany({
      where: {
        type: {
          not: PageType.landing
        },
        isPublished: true
      },
      orderBy: { title: 'asc' },
      select: {
        id: true,
        title: true,
        type: true,
        slug: true
      }
    });

    return safeJson(findManyOptions);
  },

  async getPageDataUsingSlug(slug: string) {
    const find_slug_data = await prisma.cMS.findUnique({
      where: {
        slug: slug,
        isPublished: true
      },
      select: {
        id: true,
        title: true,
        type: true,
        slug: true,
        faqs: true,
        richContent: true
      }
    });

    return safeJson(find_slug_data);
  },

  async getAllPagesList(request: Request) {
    const { searchParams } = new URL(request.url);
    const searchParam = searchParams.get('search');
    const pageParam = searchParams.get('page');
    const pageSizeParam = searchParams.get('pageSize');

    const whereClause: Prisma.CMSWhereInput = {};

    if (searchParam) {
      whereClause.OR = [{ title: { contains: searchParam, mode: 'insensitive' } }, { slug: { contains: searchParam, mode: 'insensitive' } }];
    }

    const shouldPaginate = pageParam !== null && pageSizeParam !== null;
    const page = parseInt(pageParam || '1', 10);
    const pageSize = parseInt(pageSizeParam || '10', 10);
    const skip = (page - 1) * pageSize;

    const findManyOptions: Prisma.CMSFindManyArgs = {
      where: whereClause,
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        title: true,
        type: true,
        slug: true,
        faqs: true,
        steps: true,
        isPublished: true,
        heroSection: true,
        richContent: true,
        updatedAt: true
      }
    };

    if (shouldPaginate) {
      findManyOptions.skip = skip;
      findManyOptions.take = pageSize;
    }

    const [pages, total] = await Promise.all([prisma.cMS.findMany(findManyOptions), prisma.cMS.count({ where: whereClause })]);

    return {
      pages,
      total,
      ...(shouldPaginate ? { page, pageSize } : {})
    };
  },

  async getPageDetailById(page_id: string) {
    if (!page_id) {
      throw new Error('Page id not found.');
    }

    const page_details = await prisma.cMS.findFirst({
      where: { id: BigInt(page_id) }
    });

    if (page_details) {
      return safeJson(page_details);
    } else {
      throw new Error('Page details not found.');
    }
  },

  async createCMSPage(cms_page_data: Omit<CMSPage, 'id'>): Promise<{ success: boolean; message: string }> {
    if (cms_page_data.type === PageType.landing) {
      const is_landing_page_added = await prisma.cMS.findFirst({
        where: { type: PageType.landing, isPublished: true }
      });

      if (is_landing_page_added) {
        throw new Error('A landing page already exists. Only one is allowed.');
      }
    }

    if (cms_page_data.type === PageType.faqs) {
      const is_faq_added = await prisma.cMS.findFirst({
        where: { type: PageType.faqs, isPublished: true }
      });

      if (is_faq_added) {
        throw new Error('FAQs already exists. Only one is allowed.');
      }
    }

    const is_slug_taken = await prisma.cMS.findUnique({
      where: { slug: cms_page_data.slug }
    });

    if (is_slug_taken) {
      throw new Error('Slug must be unique');
    }

    await prisma.cMS.create({
      data: {
        title: cms_page_data.title,
        slug: cms_page_data.slug,
        type: cms_page_data.type as PageType,
        isPublished: cms_page_data.isPublished || false,
        heroSection: cms_page_data.heroSection as unknown as Prisma.InputJsonValue,
        faqs: cms_page_data.faqs as unknown as Prisma.InputJsonValue,
        steps: cms_page_data.steps as unknown as Prisma.InputJsonValue,
        richContent: cms_page_data.richContent as unknown as Prisma.InputJsonValue
      }
    });

    return { success: true, message: 'The page has been successfully created.' };
  },

  async updatePageDetails(id: string, cms_update_data: Partial<CMSPage>): Promise<{ success: boolean; message: string }> {
    if (!id) {
      throw new Error('Page id not found.');
    }

    const pageType = cms_update_data.type;
    const isPublishing = cms_update_data.isPublished === true;

    if (isPublishing && (pageType === PageType.landing || pageType === PageType.faqs)) {
      const existingPublishedPage = await prisma.cMS.findFirst({
        where: {
          id: { not: BigInt(id) },
          type: pageType,
          isPublished: true
        }
      });

      if (existingPublishedPage) {
        throw new Error(`Only one "${pageType}" page can be published at a time.`);
      }
    }

    await prisma.cMS.update({
      where: { id: BigInt(id) },
      data: {
        title: cms_update_data.title,
        slug: cms_update_data.slug,
        type: cms_update_data.type as PageType,
        isPublished: cms_update_data.isPublished || false,
        heroSection: cms_update_data.heroSection as unknown as Prisma.InputJsonValue,
        faqs: cms_update_data.faqs as unknown as Prisma.InputJsonValue,
        steps: cms_update_data.steps as unknown as Prisma.InputJsonValue,
        richContent: cms_update_data.richContent as unknown as Prisma.InputJsonValue
      }
    });

    return { success: true, message: 'The page has been successfully updated.' };
  },

  async deleteCMSPage(id: string): Promise<{ success: boolean; message: string }> {
    const item = await prisma.cMS.findUnique({ where: { id: BigInt(id) } });
    if (!item) return { success: false, message: 'The cms page has been not found.' };

    await prisma.cMS.delete({ where: { id: BigInt(id) } });

    return { success: true, message: 'The cms page has been successfully deleted.' };
  }
};
