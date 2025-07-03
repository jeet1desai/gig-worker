'use client';

import { Tooltip } from 'antd';
import { Menu, MessageCircle, Search, User, Briefcase } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { useIsMobile } from '@/hooks/use-mobile';

import { Button } from '../ui/button';
import NotificationBell from '../notification-bell';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  role: 'user' | 'provider' | 'admin';
  onRoleChange: (role: 'user' | 'provider') => void;
}

export function Header({ collapsed, onToggle, role, onRoleChange }: SidebarProps) {
  const isMobile = useIsMobile();

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

          <div className="flex cursor-pointer items-center space-x-2 border-l border-slate-700 pl-2 sm:space-x-3 sm:pl-3 md:pl-4">
            <div className="hidden text-right sm:block">
              <p className="max-w-[120px] truncate text-sm font-medium text-white md:max-w-none">John Doe</p>
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
