'use client';

import { useEffect } from 'react';
import { BarChart3, LogOut, ChevronLeft } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { Images } from '@/lib/images';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', icon: BarChart3, current: true, href: '/dashboard' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const isMobile = useIsMobile();

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
        <div className="relative flex items-center justify-between border-b border-slate-700/50 px-4 py-3">
          <div
            className={cn('flex items-center space-x-2', collapsed && 'justify-center')}
          >
            <img
              src={Images.logo}
              alt="logo"
              className="relative h-12 w-12 object-contain"
            />
            {!collapsed && (
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
                Gig Workers
              </span>
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
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                'group relative flex items-center overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                item.current
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-300 hover:scale-105 hover:bg-slate-700/50 hover:text-white hover:shadow-lg',
                collapsed ? 'justify-center px-2' : 'space-x-3',
              )}
            >
              <item.icon className="relative z-10 h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="relative z-10">{item.name}</span>}
              {item.current && !collapsed && (
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
