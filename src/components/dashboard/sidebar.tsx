'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { Images } from '@/lib/images';
import { cn } from '@/lib/utils';
import { LogOut, ChevronLeft, LucideProps } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ForwardRefExoticComponent, RefAttributes, useEffect } from 'react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
  navigation_menu: Array<{
    name: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
    href: string;
  }>;
}

export function Sidebar({ collapsed, onToggle, navigation_menu }: SidebarProps) {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const isPathMatch = (itemUrl: string) => {
    return pathname === itemUrl || pathname.startsWith(`${itemUrl}/`);
  };

  useEffect(() => {
    if (isMobile) {
      onToggle(true);
    }
  }, [isMobile]);

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-50 border-r border-slate-700/50 text-white shadow-2xl backdrop-blur-xl transition-all duration-300',
        collapsed ? 'w-18' : 'w-64',
      )}
    >
      <div className="flex h-full w-full flex-col">
        <div className="relative flex items-center justify-between border-b border-slate-700/50 p-4">
          <div className={cn('flex items-center space-x-3', collapsed && 'justify-center')}>
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
              collapsed && 'hidden',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-6">
          {navigation_menu.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                'group relative flex items-center overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                isPathMatch(item.href)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-300 hover:scale-105 hover:bg-slate-700/50 hover:text-white hover:shadow-lg',
                collapsed ? 'justify-center px-2' : 'space-x-3',
              )}
            >
              <item.icon className="relative z-10 h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="relative z-10">{item.name}</span>}
              {isPathMatch(item.href) && !collapsed && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl"></div>
              )}
            </a>
          ))}
        </nav>

        <div className="border-t border-slate-700/50 p-3">
          <a
            href="#"
            className={cn(
              'group flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:scale-105 hover:bg-red-500/20 hover:text-red-400',
              collapsed ? 'justify-center px-2' : 'space-x-3',
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0 transition-transform group-hover:rotate-12" />
            {!collapsed && <span>Log Out</span>}
          </a>
        </div>
      </div>
    </div>
  );
}
