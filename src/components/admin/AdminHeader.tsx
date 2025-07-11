'use client';

import { LogOut, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCallback, useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as Popover from '@radix-ui/react-popover';
import { PUBLIC_ROUTE } from '@/constants/app-routes';
import { clearStorage } from '@/lib/local-storage';
import { useRouter } from 'next/navigation';
import CommonDeleteDialog from '../CommonDeleteDialog';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminHeader({ collapsed, onToggle }: SidebarProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<Session | null>(null);
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    setIsLoggingOut(false);
    clearStorage();
    router.push(PUBLIC_ROUTE.HOME);
    setIsLoading(false);
    router.refresh();
  }, [router]);

  const getAdminProfileDetails = async () => {
    const session = await getSession();

    setUserDetails(session);
  };

  useEffect(() => {
    getAdminProfileDetails();
  }, []);

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

        <Popover.Root open={open} onOpenChange={setOpen} modal={false}>
          <Popover.Trigger asChild>
            <div className="flex cursor-pointer items-center space-x-2 pl-2 sm:space-x-3 sm:pl-3 md:pl-4">
              <div className="hidden text-right sm:block">
                <p className="max-w-[120px] truncate text-sm font-medium text-white md:max-w-none">
                  {userDetails?.user.name || 'John Doe'}
                </p>
                <p className="hidden text-xs text-slate-400 md:block">
                  {userDetails?.user.role.charAt(0).toUpperCase() +
                    userDetails?.user.role.slice(1) || 'Web Developer'}
                </p>
              </div>
              <div className="relative">
                <Avatar className="h-8 w-8 rounded-xl object-cover ring-2 ring-blue-500/20 transition-all duration-200 hover:scale-105 hover:ring-blue-500/40">
                  <AvatarImage
                    src={userDetails?.user.image}
                    alt={userDetails?.user.name || 'Admin Profile'}
                  />
                  <AvatarFallback className="bg-transparent text-white">
                    {userDetails?.user.name
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
    </header>
  );
}
