'use client';
import AdminProtectedRoute from '@/components/routing/AdminProtectedRoute';
import { Header } from '@/components/dashboard/header';
import { Sidebar } from '@/components/dashboard/sidebar';
import { super_admin_navigation_menu } from '@/constants';
import { useState } from 'react';

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [role, setRole] = useState<'admin'>('admin');

  const handleRoleChange = (role: 'user' | 'provider') => {
    setRole('admin');
  };

  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#020d1a]">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={(collapsed) => setSidebarCollapsed(collapsed)}
          navigation_menu={super_admin_navigation_menu}
        />

        <div
          className={`w-full flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}
        >
          <Header
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            role={role}
            onRoleChange={handleRoleChange}
          />

          <main className="space-y-4 p-3 pl-5 sm:space-y-6 sm:p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}

export default Layout;
