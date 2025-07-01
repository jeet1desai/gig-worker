'use client';

import { useEffect, useState } from 'react';
import { Bell, Menu, MessageCircle, Search, User, Briefcase } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip } from 'antd';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function DashboardHeader({ collapsed, onToggle }: SidebarProps) {
  const isMobile = useIsMobile();
  const [isProvider, setIsProvider] = useState(false);

  return (
    <header className="backdrop-blur-xl border-b border-slate-700/50 p-4 pl-6 shadow-sm">
      <div className="flex items-center justify-between h-10">
        <div className="flex items-center">
          {collapsed && !isMobile && (
            <button
              onClick={() => onToggle()}
              className="cursor-pointer p-1.5 sm:p-2 rounded-xl bg-slate-700/50 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md hover:bg-slate-700 mr-1 sm:mr-2"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-slate-300" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-slate-700/50 rounded-xl p-1 gap-1">
            <button
              className={`cursor-pointer hover:scale-110 flex items-center justify-center p-1.5 rounded-lg transition-all duration-200 ${!isProvider ? 'bg-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-300'}`}
              onClick={() => setIsProvider(false)}
            >
              <Tooltip title="User">
                <User className="w-4 h-4" />
              </Tooltip>
            </button>
            <button
              className={`cursor-pointer hover:scale-110 flex items-center justify-center p-1.5 rounded-lg transition-all duration-200 ${isProvider ? 'bg-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-300'}`}
              onClick={() => setIsProvider(true)}
            >
              <Tooltip title="Provider">
                <Briefcase className="w-4 h-4" />
              </Tooltip>
            </button>
          </div>
          <button
            className="cursor-pointer p-1.5 sm:p-2 text-slate-400 hover:text-slate-300 bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-110"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            className="cursor-pointer p-1.5 sm:p-2 text-slate-400 hover:text-slate-300 bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-110 hidden sm:block"
            aria-label="Messages"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          <button
            className="cursor-pointer p-1.5 sm:p-2 text-slate-400 hover:text-slate-300 bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-110 relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold animate-pulse">
              3
            </span>
          </button>

          <div className="cursor-pointer flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-3 md:pl-4 border-l border-slate-700">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white truncate max-w-[120px] md:max-w-none">John Doe</p>
              <p className="text-xs text-slate-400 hidden md:block">Web Developer</p>
            </div>
            <div className="relative">
              <img
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-200 hover:scale-105"
                src="https://images.unsplash.com/profile-1704991443592-a7f79d25ffb1image?w=150&dpr=2&crop=faces&bg=%23fff&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                alt="Profile"
                width={32}
                height={32}
                loading="lazy"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-800"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
