import { useState, useRef, useEffect, useCallback } from 'react';
import { useNotifications } from '../hooks/use-notifications';
import { AlertCircle, Bell, Check, Clock, X } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';

const NotificationBell = ({ userId }: { userId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { unreadCount, notifications, markAsRead, markAllAsRead, fetchNotifications, isLoading, pagination } = useNotifications(userId);

  const loadMore = useCallback(() => {
    if (!isLoading && pagination.page < pagination.totalPages) {
      fetchNotifications(pagination.page + 1, pagination.limit);
    }
  }, [isLoading, pagination.page, pagination.totalPages, pagination.limit, fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getNotificationIconBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10';
      case 'warning':
        return 'bg-yellow-500/10';
      case 'error':
        return 'bg-red-500/10';
      default:
        return 'bg-blue-500/10';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="h-3.5 w-3.5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />;
      case 'error':
        return <X className="h-3.5 w-3.5 text-red-500" />;
      default:
        return <Bell className="h-3.5 w-3.5 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer rounded-xl bg-slate-700/50 p-1.5 text-slate-400 transition-all duration-200 hover:scale-110 hover:text-slate-300 sm:p-2"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[9px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="bg-foreground absolute right-0 z-50 mt-2 w-96 overflow-hidden rounded-lg border border-slate-700/50 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-700/50 p-3">
            <h3 className="text-sm font-medium text-white">Notifications</h3>
            <div className="flex items-center space-x-2">
              <button onClick={markAllAsRead} className="cursor-pointer text-xs text-blue-400 transition-colors hover:text-blue-300">
                Mark all as read
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-300"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div id="scrollableDiv" className="max-h-96 overflow-y-auto">
            <InfiniteScroll
              dataLength={notifications.length}
              next={loadMore}
              hasMore={pagination.page < pagination.totalPages}
              loader={<div className="p-4 text-center text-sm text-slate-400">Loading more...</div>}
              scrollableTarget="scrollableDiv"
              scrollThreshold={0.9}
            >
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`cursor-pointer border-b border-slate-700/30 p-3 transition-colors hover:bg-slate-700/30 ${!notification.is_read ? 'bg-slate-800/70' : ''}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`rounded-lg p-1.5 ${getNotificationIconBg(notification.type)}`}>{getNotificationIcon(notification.type)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{notification.title}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{notification.message}</p>
                      <div className="mt-1.5 flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span className="text-xs text-slate-500">{formatDate(notification.created_at)}</span>
                        {!notification.is_read && <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
            {notifications.length === 0 && (
              <div className="p-6 text-center">
                <Bell className="mx-auto mb-2 h-6 w-6 text-slate-500" />
                <p className="text-sm text-slate-400">No new notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
