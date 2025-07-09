'use client';

import { SessionProvider } from 'next-auth/react';
import { ReduxProvider } from '@/store/redux-provider';
import { SocketProvider } from '@/contexts/socket-context';
import PayPalProvider from '@/components/providers/PayPalProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider>
        <PayPalProvider>
          <SocketProvider>{children}</SocketProvider>
        </PayPalProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
