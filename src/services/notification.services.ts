import prisma, { NOTIFICATION_TYPE } from '@/lib/prisma';

export function serializeBigInt(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}

type CreateNotificationInput = {
  title: string;
  message?: string | null;
  type?: 'info' | 'success' | 'warning' | 'error';
  module?: 'system';
  relatedId?: string | null;
};

type PaginationOptions = {
  page?: number;
  limit?: number;
};

export const notificationService = {
  async createNotification(userId: string, data: CreateNotificationInput) {
    try {
      const result = await prisma.notification.create({
        data: {
          user_id: BigInt(userId),
          title: data.title,
          message: data.message,
          type: data?.type || NOTIFICATION_TYPE.info,
          module: data?.module || 'system',
          related_id: data?.relatedId ? BigInt(data.relatedId) : null
        }
      });
      return serializeBigInt(result);
    } catch (error) {
      throw new Error(
        `Failed to create notification: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await prisma.notification.count({
        where: {
          user_id: BigInt(userId),
          is_read: false
        }
      });
    } catch (error) {
      throw new Error(
        `Failed to get unread count: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  async markAsRead(notificationId: string) {
    try {
      return await prisma.notification.update({
        where: { id: BigInt(notificationId) },
        data: { is_read: true }
      });
    } catch (error) {
      throw new Error(
        `Failed to mark notification as read: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  async markAllAsRead(userId: string) {
    try {
      return await prisma.notification.updateMany({
        where: {
          user_id: BigInt(userId),
          is_read: false
        },
        data: { is_read: true }
      });
    } catch (error) {
      throw new Error(
        `Failed to mark all notifications as read: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  async getUserNotifications(userId: string, options: PaginationOptions = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    try {
      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where: { user_id: BigInt(userId) },
          orderBy: { created_at: 'desc' },
          skip,
          take: limit,
          select: {
            id: true,
            title: true,
            message: true,
            type: true,
            module: true,
            is_read: true,
            related_id: true,
            created_at: true,
            updated_at: true
          }
        }),
        prisma.notification.count({ where: { user_id: BigInt(userId) } })
      ]);

      return {
        data: notifications.map((notification) => ({
          ...notification,
          id: notification.id.toString(),
          related_id: notification.related_id?.toString() ?? null
        })),
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
          limit
        }
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch notifications: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  async deleteNotification(notificationId: string) {
    try {
      return await prisma.notification.delete({
        where: { id: BigInt(notificationId) }
      });
    } catch (error) {
      throw new Error(
        `Failed to delete notification: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
};
