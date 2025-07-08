'use client';

import { Tooltip } from 'antd';
import { Menu, MessageCircle, Search, User, Briefcase, LogOut } from 'lucide-react';
import { useCallback, useState } from 'react';

import { useIsMobile } from '@/hooks/use-mobile';
import * as Popover from "@radix-ui/react-popover";

import { Button } from '../ui/button';
import { signOut } from 'next-auth/react';
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '@/constants/app-routes';
import { useRouter } from 'next/navigation';
import NotificationBell from '../notification-bell';
import Link from 'next/link';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  role: 'user' | 'provider' | 'admin';
  onRoleChange: (role: 'user' | 'provider') => void;
}

export function Header({ collapsed, onToggle, role, onRoleChange }: SidebarProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push(PUBLIC_ROUTE.HOME);
    router.refresh();
  }, [router, PUBLIC_ROUTE.HOME]);

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
          {role !== 'admin' && (
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
          )}

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

          <NotificationBell userId="5" />

          <Popover.Root open={open} onOpenChange={setOpen} modal={false}>
            <Popover.Trigger asChild>
              <div className="flex cursor-pointer items-center space-x-2 border-l border-slate-700 pl-4">
                <div className="hidden text-right sm:block">
                  <p className="max-w-[120px] truncate text-sm font-medium text-white">John Doe</p>
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
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content
                sideOffset={8}
                align="end"
                className="z-50 mt-2 w-44 rounded-md border border-slate-700 bg-slate-800 p-1 text-white shadow-lg"
              >
                <Link
                  href={PRIVATE_ROUTE.USER_PROFILE}
                  className="flex items-center space-x-2 cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-slate-700 w-full outline-none focus:outline-none focus-visible:ring-0" 
                  >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-slate-700 w-full">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
    </header>
  );
}
