'use client';

import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '@/constants/app-routes';
import { useIsMobile } from '@/hooks/use-mobile';
import { Images } from '@/lib/images';
import { cn } from '@/lib/utils';
import { LogOut, ChevronLeft, ChevronDown, LucideProps, ChevronUp } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ForwardRefExoticComponent, RefAttributes, useCallback, useEffect, useState } from 'react';
import CommonDeleteDialog from '../CommonDeleteDialog';
import { clearStorage } from '@/lib/local-storage';

interface SidebarProps {
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
  navigation_menu: Array<{
    name: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
    href: string;
    sub_navigation: Array<{
      name: string;
      icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
      href: string;
    }>;
  }>;
}

export function Sidebar({ collapsed, onToggle, navigation_menu }: SidebarProps) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const isPathMatch = (url: string) => pathname === url || pathname.startsWith(`${url}/`);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    setIsLoggingOut(false);
    clearStorage();
    router.push(PUBLIC_ROUTE.HOME);
    setIsLoading(false);
    router.refresh();
  }, [router]);

  const redirectToHome = useCallback(() => {
    router.push(PUBLIC_ROUTE.HOME);
  }, [router]);

  const toggleSubMenu = (menuName: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  useEffect(() => {
    if (isMobile) {
      onToggle(true);
    }
  }, [isMobile]);

  useEffect(() => {
    const matchedMenu = navigation_menu.find((item) => item.sub_navigation?.some((sub) => isPathMatch(sub.href)));
    if (matchedMenu) {
      setOpenMenus((prev) => ({ ...prev, [matchedMenu.name]: true }));
    }
  }, [pathname, navigation_menu]);

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-50 border-r border-slate-700/50 text-white shadow-2xl backdrop-blur-xl transition-all duration-300',
        collapsed ? 'w-18' : 'w-64'
      )}
    >
      <div className="flex h-full w-full flex-col">
        <div className="relative flex items-center justify-between border-b border-slate-700/50 p-4">
          <div className={cn('flex cursor-pointer items-center space-x-3', collapsed && 'justify-center')} onClick={redirectToHome}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-lg">
              <div className="relative flex aspect-[200/113] w-[200px] items-center justify-center">
                <Image src={Images.logo} alt="logo" fill className="object-contain object-center" />
              </div>
            </div>
            {!collapsed && (
              <div className="max-w-auto relative flex aspect-[150/25] w-[150px] items-center justify-center">
                <Image src={Images.big_logo_icon} alt="big_logo" fill className="object-contain object-center" />
              </div>
            )}
          </div>
          <button
            onClick={() => onToggle(!collapsed)}
            className={cn(
              'absolute top-5 -right-4 cursor-pointer rounded-full bg-slate-700/50 p-2.5 transition-all duration-200 hover:scale-110',
              collapsed && 'hidden'
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
          {navigation_menu.map((item) => {
            const hasSubNav = item.sub_navigation && item.sub_navigation.length > 0;
            const isSubOpen = openMenus[item.name];

            return (
              <div key={item.name} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (hasSubNav) {
                      toggleSubMenu(item.name);
                    } else {
                      router.push(item.href);
                    }
                  }}
                  className={cn(
                    'group relative flex w-full items-center overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    isPathMatch(item.href)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-300 hover:scale-105 hover:bg-slate-700/50 hover:text-white hover:shadow-lg',
                    collapsed ? 'justify-center px-2' : 'space-x-3'
                  )}
                >
                  <item.icon className="relative z-10 h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="relative z-10 flex-1 text-left">{item.name}</span>
                    </>
                  )}
                  {hasSubNav &&
                    (isSubOpen ? (
                      <ChevronUp className={cn('h-4 w-4 text-slate-400', isPathMatch(item.href) && 'text-white')} />
                    ) : (
                      <ChevronDown className={cn('h-4 w-4 text-slate-400', isPathMatch(item.href) && 'text-white')} />
                    ))}
                </button>

                {hasSubNav && isSubOpen && !collapsed && (
                  <div className="mt-1 ml-6 space-y-1">
                    {item.sub_navigation.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          'group flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                          isPathMatch(subItem.href)
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                            : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'
                        )}
                      >
                        <subItem.icon className="h-4 w-4 flex-shrink-0" />
                        <span>{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {hasSubNav && isSubOpen && collapsed && (
                  <div className="mt-1 ml-2 space-y-1">
                    {item.sub_navigation.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          'group flex items-center justify-start rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200',
                          isPathMatch(subItem.href)
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                            : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'
                        )}
                      >
                        <subItem.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-slate-700/50 p-3">
          <button
            onClick={() => setIsLoggingOut(true)}
            className={cn(
              'group flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:scale-105 hover:bg-red-500/20 hover:text-red-400',
              collapsed ? 'justify-center px-2' : 'space-x-3'
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0 transition-transform group-hover:rotate-12" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
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
    </div>
  );
}
