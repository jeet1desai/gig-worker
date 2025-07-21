import { WORKING_STEPS_MOVE_DIRECTION } from '@/constants';
import prisma from '@/lib/prisma';
import { safeJson } from '@/lib/utils/safeJson';
import { ContentItem, WorkingStepDirectionType } from '@/types/fe';

export const contentService = {
  async getContentByType(type: string) {
    const all_content = await prisma.cMS.findMany({
      where: { type },
      orderBy: { order: 'asc' }
    });

    return safeJson(all_content);
  },

  async createContent(data: Omit<ContentItem, 'id'>): Promise<{ success: boolean; message: string }> {
    const maxOrder = await prisma.cMS.findFirst({
      where: { type: data.type },
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    await prisma.cMS.create({
      data: {
        type: data.type,
        title: data.title,
        content: data.content,
        isVisible: data.isVisible,
        color: data.color,
        order: (maxOrder?.order || 0) + 1
      }
    });

    return { success: true, message: 'The content has been successfully created.' };
  },

  async updateContent(id: string, data: Partial<any>): Promise<{ success: boolean; message: string }> {
    await prisma.cMS.update({
      where: { id: BigInt(id) },
      data
    });

    return { success: true, message: 'The content has been successfully updated.' };
  },

  async deleteContent(id: string): Promise<{ success: boolean; message: string }> {
    const item = await prisma.cMS.findUnique({ where: { id: BigInt(id) } });
    if (!item) return { success: false, message: 'The content has been successfully created.' };

    await prisma.cMS.delete({ where: { id: BigInt(id) } });

    const remainingItems = await prisma.cMS.findMany({
      where: { type: item.type },
      orderBy: { order: 'asc' }
    });

    for (let i = 0; i < remainingItems.length; i++) {
      await prisma.cMS.update({
        where: { id: remainingItems[i].id },
        data: { order: i + 1 }
      });
    }

    return { success: true, message: 'The content has been successfully created.' };
  },

  async reorderContent(data: { id: string; direction: WorkingStepDirectionType }): Promise<{ success: boolean; message: string }> {
    const item = await prisma.cMS.findUnique({ where: { id: BigInt(data.id) } });
    if (!item) throw new Error('Content item not found');

    const items = await prisma.cMS.findMany({
      where: { type: item.type },
      orderBy: { order: 'asc' }
    });

    const currentIndex = items.findIndex((i) => i.id === BigInt(data.id));
    const targetIndex = data.direction === WORKING_STEPS_MOVE_DIRECTION.up ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= items.length) {
      throw new Error('Cannot move content in that direction');
    }

    const currentItem = items[currentIndex];
    const targetItem = items[targetIndex];

    await prisma.$transaction([
      prisma.cMS.update({
        where: { id: currentItem.id },
        data: { order: targetItem.order }
      }),
      prisma.cMS.update({
        where: { id: targetItem.id },
        data: { order: currentItem.order }
      })
    ]);

    return { success: true, message: 'The content has been reordered successfully.' };
  }
};
