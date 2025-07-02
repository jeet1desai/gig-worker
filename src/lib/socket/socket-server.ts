import { Server, Socket } from 'socket.io';
import { notificationService } from '@/services/notification.services';

type IOServer = InstanceType<typeof Server>;

type UserSockets = Map<string, Set<string>>;
export const users: UserSockets = new Map();

export function emitToUser(io: IOServer, userId: string, event: string, data: unknown) {
  const userSockets = users.get(userId);
  if (userSockets) {
    userSockets.forEach((socketId) => {
      io.to(socketId).emit(event, data);
    });
  }
}

export function initializeSocket(io: IOServer) {
  io.on('connection', (socket: Socket) => {
    let userId: string | null = null;

    socket.on('register', async (userId: string) => {
      if (!users.has(userId)) {
        users.set(userId, new Set());
      }
      users.get(userId)?.add(socket.id);

      if (userId) {
        const unreadCount = await notificationService.getUnreadCount(userId);
        const recentNotifications = await notificationService.getUserNotifications(userId);
        socket.emit('notification:unread_count', { count: unreadCount });
        socket.emit('notification:list', recentNotifications);
      }
      userId = userId;
    });

    socket.on('notification:get_unread_count', async (userId: string) => {
      if (!userId) return;
      const count = await notificationService.getUnreadCount(userId);
      socket.emit('notification:unread_count', { count });
    });

    socket.on('notification:mark_as_read', async ({ userId, notificationId }: { userId: string; notificationId: string }) => {
      if (!userId) return;
      await notificationService.markAsRead(notificationId);
      const count = await notificationService.getUnreadCount(userId);
      socket.emit('notification:unread_count', { count });
    });

    socket.on('notification:mark_all_as_read', async ({ userId }: { userId: string }) => {
      if (!userId) return;
      await notificationService.markAllAsRead(userId);
      socket.emit('notification:unread_count', { count: 0 });
    });

    socket.on('notification:get_notification_list', async ({ userId, page, limit }: { userId: string; page: number; limit: number }) => {
      if (!userId) return;
      const result = await notificationService.getUserNotifications(userId, {
        page,
        limit,
      });
      socket.emit('notification:list', result);
    });

    socket.on('disconnect', () => {
      if (userId && users.has(userId)) {
        const userSockets = users.get(userId);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0) {
            users.delete(userId);
          }
        }
      }
    });
  });
}

export async function sendNotification(io: IOServer, userId: string, notificationData: any) {
  try {
    const notification = await notificationService.createNotification(userId, notificationData);
    const unreadCount = await notificationService.getUnreadCount(userId);

    emitToUser(io, userId, 'notification:new', {
      ...notification,
      id: notification.id.toString(),
      user_id: notification.user_id.toString(),
      related_id: notification.related_id?.toString(),
    });

    emitToUser(io, userId, 'notification:unread_count', { count: unreadCount });

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}
