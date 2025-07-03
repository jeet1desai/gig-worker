'use client';
import AdminProtectedRoute from '@/components/routing/AdminProtectedRoute';
import { Sidebar } from '@/components/dashboard/sidebar';
import { ADMIN_DASHBOARD_NAVIGATION_MENU } from '@/constants';
import { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#020d1a]">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={(collapsed) => setSidebarCollapsed(collapsed)}
          navigation_menu={ADMIN_DASHBOARD_NAVIGATION_MENU}
        />

        <div
          className={`flex h-screen w-full flex-1 flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}
        >
          <AdminHeader
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <main className="no-scrollbar flex-1 space-y-4 overflow-y-auto p-3 pl-5 sm:space-y-6 sm:p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}

export default Layout;
