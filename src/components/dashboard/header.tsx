'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Tooltip } from 'antd';
import {
  Bell,
  Menu,
  MessageCircle,
  Search,
  User,
  Briefcase,
  Clock,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '../ui/button';
import { signOut } from 'next-auth/react';
import { PUBLIC_ROUTE } from '@/constants/app-routes';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  role: 'user' | 'provider';
  onRoleChange: (role: 'user' | 'provider') => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
}

export function Header({ collapsed, onToggle, role, onRoleChange }: SidebarProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New message',
      message: 'You have a new message from Jane Smith',
      time: '2 min ago',
      type: 'info',
      read: false,
    },
    {
      id: '2',
      title: 'Payment received',
      message: 'Your payment of $120 has been processed',
      time: '1 hour ago',
      type: 'success',
      read: false,
    },
    {
      id: '3',
      title: 'New update available',
      message: 'A new version of the app is available',
      time: '3 hours ago',
      type: 'warning',
      read: true,
    },
    {
      id: '4',
      title: 'Server maintenance',
      message: 'Scheduled maintenance in your region',
      time: '1 day ago',
      type: 'error',
      read: true,
    },
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push(PUBLIC_ROUTE.HOME);
    // router.refresh();
  }, [router, PUBLIC_ROUTE.HOME]);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
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

  return (
    <header className="border-b border-slate-700/50 p-4 pl-6 shadow-sm">
      <div className="flex h-10 items-center justify-between">
        <div className="flex items-center">
          {collapsed && !isMobile && (
            <button
              onClick={() => onToggle()}
              className="mr-1 cursor-pointer rounded-xl bg-slate-700/50 p-1.5 shadow-sm transition-all duration-200 hover:scale-110 hover:bg-slate-700 hover:shadow-md sm:mr-2 sm:p-2"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5 text-slate-300" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-1 rounded-xl bg-slate-700/50 p-1">
            <Button
              className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg p-2 transition-all duration-200 hover:scale-110 ${role == 'user' ? 'bg-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-300'}`}
              onClick={() => onRoleChange('user')}
            >
              <Tooltip title="User">
                <User className="h-4 w-4" />
              </Tooltip>
            </Button>
            <Button
              className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg p-2 transition-all duration-200 hover:scale-110 ${role == 'provider' ? 'bg-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-300'}`}
              onClick={() => onRoleChange('provider')}
            >
              <Tooltip title="Provider">
                <Briefcase className="h-4 w-4" />
              </Tooltip>
            </Button>
          </div>

          <button
            className="cursor-pointer rounded-xl bg-slate-700/50 p-1.5 text-slate-400 transition-all duration-200 hover:scale-110 hover:text-slate-300 sm:p-2"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            className="hidden cursor-pointer rounded-xl bg-slate-700/50 p-1.5 text-slate-400 transition-all duration-200 hover:scale-110 hover:text-slate-300 sm:block sm:p-2"
            aria-label="Messages"
          >
            <MessageCircle className="h-4 w-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative cursor-pointer rounded-xl bg-slate-700/50 p-1.5 text-slate-400 transition-all duration-200 hover:scale-110 hover:text-slate-300 sm:p-2"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[9px] font-bold text-white">
                3
              </span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="font-medium text-[#FFF2E3] bg-transparent border-none p-0 cursor-pointer pl-3"
            >
              Logout
            </button>

            {showNotifications && (
              <div className="bg-foreground absolute right-0 z-50 mt-2 w-96 overflow-hidden rounded-lg border border-slate-700/50 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-700/50 p-3">
                  <h3 className="text-sm font-medium text-white">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    <button className="cursor-pointer text-xs text-blue-400 transition-colors hover:text-blue-300">
                      Mark all as read
                    </button>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="cursor-pointer rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-300"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`cursor-pointer border-b border-slate-700/30 p-3 transition-colors hover:bg-slate-700/30 ${!notification.read ? 'bg-slate-800/70' : ''}`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`rounded-lg p-1.5 ${getNotificationIconBg(notification.type)}`}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-white">
                              {notification.title}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {notification.message}
                            </p>
                            <div className="mt-1.5 flex items-center space-x-2">
                              <Clock className="h-3 w-3 text-slate-500" />
                              <span className="text-xs text-slate-500">
                                {notification.time}
                              </span>
                              {!notification.read && (
                                <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <Bell className="mx-auto mb-2 h-6 w-6 text-slate-500" />
                      <p className="text-sm text-slate-400">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex cursor-pointer items-center space-x-2 border-l border-slate-700 pl-2 sm:space-x-3 sm:pl-3 md:pl-4">
            <div className="hidden text-right sm:block">
              <p className="max-w-[120px] truncate text-sm font-medium text-white md:max-w-none">
                John Doe
              </p>
              <p className="hidden text-xs text-slate-400 md:block">Web Developer</p>
            </div>
            <div className="relative">
              <img
                className="h-7 w-7 rounded-xl object-cover ring-2 ring-blue-500/20 transition-all duration-200 hover:scale-105 hover:ring-blue-500/40 sm:h-8 sm:w-8"
                src="https://images.unsplash.com/profile-1704991443592-a7f79d25ffb1image?w=150&dpr=2&crop=faces&bg=%23fff&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                alt="Profile"
                width={32}
                height={32}
                loading="lazy"
              />
              <div className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-800 bg-green-500"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
