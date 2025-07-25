'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { RootState } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { setUserRole } from '@/store/slices/user';
import { useSession } from 'next-auth/react';
import { PRIVATE_ROUTE } from '@/constants/app-routes';
import { ClipboardList, Layers3 } from 'lucide-react';
import { DASHBOARD_NAVIGATION_MENU } from '@/constants';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: session } = useSession();
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
      <Sidebar collapsed={sidebarCollapsed} onToggle={(collapsed) => setSidebarCollapsed(collapsed)} navigation_menu={navigationMenu} />

      <div className={`w-full flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'ml-18' : 'ml-64'}`}>
        <Header
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          role={role}
          onRoleChange={handleRoleChange}
          subscriptionType={session?.user.subscriptionType}
        />

        <div className="mt-18">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
