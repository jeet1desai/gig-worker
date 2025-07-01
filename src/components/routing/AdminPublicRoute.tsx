'use client';

import { PRIVATE_ROUTE } from '@/constants/app-routes';
import { ADMIN_AUTH_TOKEN_KEY } from '@/constants/local-storage-keys';
import { getStorage } from '@/lib/local-storage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPublicRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const token = getStorage(ADMIN_AUTH_TOKEN_KEY);
    if (token) {
      router.replace(PRIVATE_ROUTE.ADMIN_DASHBOARD_PATH);
    }
  }, []);
  return <>{children}</>;
}
