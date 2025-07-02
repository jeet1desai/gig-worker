import AdminProtectedRoute from '@/components/routing/AdminProtectedRoute';
import React from 'react';

function AdminDashboard() {
  return (
    <AdminProtectedRoute>
      <div>Admin Dashboard</div>
    </AdminProtectedRoute>
  );
}

export default AdminDashboard;
