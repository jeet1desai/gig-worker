import { useEffect, useState, useCallback } from 'react';
import { socketManager } from '../lib/socket/socket-manager';

type Notification = {
  id: string;
  title: string;
  message?: string | null;
  type: string;
  is_read: boolean;
  related_id?: string | null;
  created_at: string;
  updated_at: string;
};

type NotificationListResponse = {
  data: Notification[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
};

export function useNotifications(userId?: string) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchNotifications = useCallback(
    async (page = pagination.page, limit = pagination.limit) => {
      if (!userId) return;

      setIsLoading(true);
      try {
        socketManager.emit('notification:get_notification_list', { userId, page, limit });
      } finally {
        setIsLoading(false);
      }
    },
    [userId],
  );

  const markAsRead = useCallback(
    (notificationId: string) => {
      if (!userId) return;
      const notificationIndex = notifications.findIndex((item) => BigInt(item.id) === BigInt(notificationId));
      if (notificationIndex !== -1) {
        const updatedNotifications = [...notifications];
        updatedNotifications[notificationIndex].is_read = true;
        setNotifications(updatedNotifications);
      }
      socketManager.emit('notification:mark_as_read', { userId, notificationId });
    },
    [notifications],
  );

  const markAllAsRead = useCallback(() => {
    if (!userId) return;
    const updatedNotifications = notifications.map((item) => ({
      ...item,
      is_read: true,
    }));
    setNotifications(updatedNotifications);
    socketManager.emit('notification:mark_all_as_read', { userId });
  }, [notifications]);

  useEffect(() => {
    if (!userId) return;

    socketManager.emit('notification:get_unread_count', userId);
    socketManager.emit('notification:get_notification_list', {
      userId,
      page: pagination.page,
      limit: pagination.limit,
    });

    const onUnreadCount = (data: { count: number }) => {
      setUnreadCount(data.count);
    };

    const onNewNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const onNotificationList = (data: NotificationListResponse) => {
      setNotifications((prev) => (data.pagination.page === 1 ? data.data : [...prev, ...data.data]));
      setPagination(data.pagination);
    };

    socketManager.on('notification:unread_count', onUnreadCount);
    socketManager.on('notification:new', onNewNotification);
    socketManager.on('notification:list', onNotificationList);

    fetchNotifications();

    return () => {
      socketManager.off('notification:unread_count', onUnreadCount);
      socketManager.off('notification:new', onNewNotification);
      socketManager.off('notification:list', onNotificationList);
    };
  }, [userId, fetchNotifications]);

  return {
    unreadCount,
    notifications,
    isLoading,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
