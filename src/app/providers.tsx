'use client';

import { SessionProvider } from 'next-auth/react';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import { ReduxProvider } from '@/store/redux-provider';
import { SocketProvider } from '@/contexts/socket-context';
import PayPalProvider from '@/components/providers/PayPalProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider>
        <PayPalProvider>
          <AntdRegistry>
            <SocketProvider>{children}</SocketProvider>
          </AntdRegistry>
        </PayPalProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
