'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Menu, MessageCircle, Search, User, Briefcase } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NotificationBell from '../notification-bell';
import { PUBLIC_ROUTE } from '@/constants/app-routes';
import { useIsMobile } from '@/hooks/use-mobile';
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

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push(PUBLIC_ROUTE.HOME);
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
                        role === 'user' ? 'bg-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-300'
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
                        role === 'provider' ? 'bg-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-300'
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

            <Button variant="ghost" onClick={handleLogout} className="pl-3 text-[#FFF2E3] hover:bg-transparent hover:text-red-400">
              Logout
            </Button>

            <div className="flex cursor-pointer items-center space-x-2 border-l border-slate-700 pl-2 sm:space-x-3 sm:pl-3 md:pl-4">
              <div className="hidden text-right sm:block">
                <p className="max-w-[120px] truncate text-sm font-medium text-white md:max-w-none">John Doe</p>
                <p className="hidden text-xs text-slate-400 md:block">Web Developer</p>
              </div>
              <div className="relative">
                <Avatar className="h-8 w-8 rounded-xl object-cover ring-2 ring-blue-500/20 transition-all duration-200 hover:scale-105 hover:ring-blue-500/40">
                  <AvatarImage
                    src="https://images.unsplash.com/profile-1704991443592-a7f79d25ffb1image?w=150&dpr=2&crop=faces&bg=%23fff&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                    alt={'User Profile'}
                  />
                  <AvatarFallback className="text-white">UP</AvatarFallback>
                </Avatar>

                <div className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-800 bg-green-500"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
