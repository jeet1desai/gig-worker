'use client';

import { useState } from 'react';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { setUserRole } from '@/store/slices/user';
import { DASHBOARD_NAVIGATION_MENU } from '@/constants';
import LandingHeader from '@/components/Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { data: session } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.user);

  const handleRoleChange = (role: 'user' | 'provider') => {
    dispatch(setUserRole({ role }));
  };

  return (
    <div className="bg-foreground flex min-h-screen w-full">
      {session ? (
        <>
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={(collapsed) => setSidebarCollapsed(collapsed)}
            navigation_menu={DASHBOARD_NAVIGATION_MENU}
          />

          <div
            className={`w-full flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'ml-18' : 'ml-64'}`}
          >
            <Header
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              role={role}
              onRoleChange={handleRoleChange}
            />

            <div className="mt-18">{children}</div>
          </div>
        </>
      ) : (
        <div
          className={`w-full flex-1 overflow-hidden transition-all duration-300`}
        >
          <LandingHeader />

          <div className="">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
