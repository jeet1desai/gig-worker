'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { RootState } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { setUserRole } from '@/store/slices/user';
import { PRIVATE_ROUTE } from '@/constants/app-routes';
import { ClipboardList, Layers3 } from 'lucide-react';
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

  const navigationMenu = useMemo(() => {
    const subscriptionType = session?.user.subscription;
    const dynamicMenu = [...DASHBOARD_NAVIGATION_MENU];

    const hasValidSubscription = subscriptionType === 'basic' || subscriptionType === 'pro';

    if (hasValidSubscription) {
      if (role === 'user') {
        dynamicMenu.push({
          name: 'Manage My Gigs',
          icon: ClipboardList,
          href: PRIVATE_ROUTE.USER_GIGS
        });
      }

      if (role === 'provider') {
        dynamicMenu.push({
          name: 'Manage Bids',
          icon: Layers3,
          href: PRIVATE_ROUTE.PROVIDER_BIDS
        });
      }
    }

    return dynamicMenu;
  }, [session?.user.subscriptionType, role]);

  return (
    <div className="bg-foreground flex min-h-screen w-full">
      {session ? (
        <>
          <Sidebar collapsed={sidebarCollapsed} onToggle={(collapsed) => setSidebarCollapsed(collapsed)} navigation_menu={navigationMenu} />

          <div
            className={`flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'ml-18' : 'ml-64'}`}
          >
            <Header
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              role={role}
              onRoleChange={handleRoleChange}
              subscriptionType={session?.user.subscriptionType}
            />

            <div className="mt-18 flex-1">{children}</div>
          </div>
        </>
      ) : (
        <div className={`flex min-h-0 w-full flex-1 flex-col overflow-hidden transition-all duration-300`}>
          <LandingHeader />

          <div className="flex-1">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
