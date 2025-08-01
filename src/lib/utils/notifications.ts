import { socketManager } from '../socket/socket-manager';

export const notificationHelper = {
  async sendNotification(userId: string, notification: any) {
    socketManager.emit('notification:send', {
      userId: userId,
      notificationData: notification
    });
  }
};

export default notificationHelper;
