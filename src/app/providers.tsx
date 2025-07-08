'use client';

import { ReduxProvider } from '@/store/redux-provider';
import { SocketProvider } from '@/contexts/socket-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <SocketProvider>{children}</SocketProvider>
    </ReduxProvider>
  );
}
