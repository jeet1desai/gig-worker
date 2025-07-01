'use client';

import { PUBLIC_ROUTE } from '@/constants/app-routes';
import { ADMIN_AUTH_TOKEN_KEY } from '@/constants/local-storage-keys';
import { getStorage } from '@/lib/local-storage';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = getStorage(ADMIN_AUTH_TOKEN_KEY);
    if (!token) {
      router.replace(PUBLIC_ROUTE.ADMIN_LOGIN_PATH);
    } else {
      setIsVerified(true);
    }
  }, []);

  if (!isVerified) return null;

  return <>{children}</>;
}
