import { Server } from 'socket.io';
import { sendNotification } from '@/lib/socket/socket-server';

type NotificationType = 'info' | 'success' | 'warning' | 'error';
type NotificationModule = 'system';

export const notificationHelper = {
  async sendNotification(
    io: Server,
    userId: string,
    type?: NotificationType,
    title?: string,
    message?: string,
    module?: NotificationModule,
    relatedId?: string,
  ) {
    return sendNotification(io, userId, { title, message, type, module, relatedId });
  },
};

export default notificationHelper;
