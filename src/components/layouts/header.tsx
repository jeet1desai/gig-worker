'use client';

import { Menu, MessageCircle, Search, User, Briefcase, LogOut } from 'lucide-react';
import { useCallback, useState } from 'react';

import { useIsMobile } from '@/hooks/use-mobile';
import * as Popover from '@radix-ui/react-popover';

import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '@/constants/app-routes';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import NotificationBell from '../notification-bell';
import Link from 'next/link';
import { clearStorage } from '@/lib/local-storage';
import CommonDeleteDialog from '../CommonDeleteDialog';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const { data: session } = useSession();

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    setIsLoggingOut(false);
    clearStorage();
    router.push(PUBLIC_ROUTE.HOME);
    setIsLoading(false);
    router.refresh();
  }, [router]);

  return (
    <TooltipProvider>
      <header className="border-b border-slate-700/50 p-4 pl-6 shadow-sm">
        <div className="flex h-10 items-center justify-between">
          <div className="flex items-center">
            {collapsed && !isMobile && (
              <button
                onClick={onToggle}
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-7 w-7 p-2 transition-all duration-200 hover:scale-110 ${
                        role === 'user'
                          ? 'bg-slate-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                      onClick={() => onRoleChange('user')}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent> User </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-7 w-7 p-2 transition-all duration-200 hover:scale-110 ${
                        role === 'provider'
                          ? 'bg-slate-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                      onClick={() => onRoleChange('provider')}
                    >
                      <Briefcase className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent> Provider </TooltipContent>
                </Tooltip>
              </div>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="cursor-pointer rounded-xl bg-slate-700/50 p-1.5 text-slate-400 transition-all duration-200 hover:scale-110 hover:text-slate-300 sm:p-2"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Search</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="hidden cursor-pointer rounded-xl bg-slate-700/50 p-1.5 text-slate-400 transition-all duration-200 hover:scale-110 hover:text-slate-300 sm:block sm:p-2"
                  aria-label="Messages"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Messages</TooltipContent>
            </Tooltip>

            <NotificationBell userId="5" />

            <Popover.Root open={open} onOpenChange={setOpen} modal={false}>
              <Popover.Trigger asChild>
                <div className="flex cursor-pointer items-center space-x-2 border-l border-slate-700 pl-4">
                  <div className="hidden text-right sm:block">
                    <p className="max-w-[120px] truncate text-sm font-medium text-white">
                      {session?.user.name}
                    </p>
                    <p className="hidden text-xs text-slate-400 md:block">
                      {session?.user.role.charAt(0).toUpperCase() +
                        session?.user.role.slice(1) || 'Web Developer'}
                    </p>
                  </div>
                  <div className="relative">
                    <Avatar className="h-8 w-8 rounded-xl object-cover ring-2 ring-blue-500/20 transition-all duration-200 hover:scale-105 hover:ring-blue-500/40">
                      <AvatarImage
                        src={session?.user.image}
                        alt={session?.user.name || 'User Profile'}
                      />
                      <AvatarFallback className="bg-transparent text-white">
                        {session?.user.name
                          ?.split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .slice(0, 2) || 'AD'}
                      </AvatarFallback>
                    </Avatar>
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
                    className="flex w-full cursor-pointer items-center space-x-2 rounded-md px-3 py-2 text-sm outline-none hover:bg-slate-700 focus:outline-none focus-visible:ring-0"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => setIsLoggingOut(true)}
                    className="flex w-full cursor-pointer items-center space-x-2 rounded-md px-3 py-2 text-sm outline-none hover:bg-slate-700 focus:outline-none focus-visible:ring-0"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
      </header>
      {isLoggingOut && (
        <CommonDeleteDialog
          open={isLoggingOut}
          title="Logout"
          isLoading={isLoading}
          description="Are you sure you want to logout?"
          onConfirm={handleLogout}
          cancelLabel="Cancel"
          confirmLabel="Logout"
          onOpenChange={setIsLoggingOut}
        />
      )}
    </TooltipProvider>
  );
}
