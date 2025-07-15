'use client';

import { useState } from 'react';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUserRole } from '@/store/slices/user';
import { DASHBOARD_NAVIGATION_MENU } from '@/constants';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.user);

  const handleRoleChange = (role: 'user' | 'provider') => {
    dispatch(setUserRole({ role }));
  };

  return (
    <div className="bg-foreground flex min-h-screen w-full">
      <Sidebar collapsed={sidebarCollapsed} onToggle={(collapsed) => setSidebarCollapsed(collapsed)} navigation_menu={DASHBOARD_NAVIGATION_MENU} />

      <div className={`w-full flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'ml-18' : 'ml-64'}`}>
        <Header collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} role={role} onRoleChange={handleRoleChange} />

        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
