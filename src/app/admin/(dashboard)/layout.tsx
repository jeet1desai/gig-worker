'use client';
import AdminProtectedRoute from '@/components/routing/AdminProtectedRoute';
import { Sidebar } from '@/components/layouts/sidebar';
import { ADMIN_DASHBOARD_NAVIGATION_MENU } from '@/constants';
import { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import Loader from '@/components/Loader';

function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (isLoggingOut) {
    return <Loader isLoading={true} />;
  }

  return (
    <AdminProtectedRoute>
      <div className="bg-foreground flex min-h-screen w-full">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={(collapsed) => setSidebarCollapsed(collapsed)}
          navigation_menu={ADMIN_DASHBOARD_NAVIGATION_MENU}
          onStartLogout={() => setIsLoggingOut(true)}
        />

        <div className={`w-full flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <AdminHeader collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

          <main className="space-y-4 p-3 pl-5 sm:space-y-6 sm:p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}

export default Layout;
