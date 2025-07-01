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

const navigation = [{ name: 'Dashboard', icon: BarChart3, current: true, href: '/dashboard' }];

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
        'fixed inset-y-0 left-0 z-50 text-white transition-all duration-300 shadow-2xl backdrop-blur-xl border-r border-slate-700/50',
        collapsed ? 'w-18' : 'w-64',
      )}
    >
      <div className="flex h-full w-full flex-col">
        <div className="relative flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
          <div className={cn('flex items-center space-x-2', collapsed && 'justify-center')}>
            <img src={Images.logo} alt="logo" className="relative object-contain w-12 h-12" />
            {!collapsed && (
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Gig Workers</span>
            )}
          </div>
          <button
            onClick={() => onToggle(!collapsed)}
            className={cn(
              'cursor-pointer absolute top-5 -right-4 p-2.5 rounded-full bg-slate-700/50 transition-all duration-200 hover:scale-110',
              collapsed && 'hidden',
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden',
                item.current
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-lg hover:scale-105',
                collapsed ? 'justify-center px-2' : 'space-x-3',
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0 relative z-10" />
              {!collapsed && <span className="relative z-10">{item.name}</span>}
              {item.current && !collapsed && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-xl"></div>
              )}
            </a>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-700/50">
          <a
            href="#"
            className={cn(
              'flex items-center px-4 py-3 text-sm font-medium text-slate-300 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 group hover:scale-105',
              collapsed ? 'justify-center px-2' : 'space-x-3',
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 group-hover:rotate-12 transition-transform" />
            {!collapsed && <span>Log Out</span>}
          </a>
        </div>
      </div>
    </div>
  );
}
