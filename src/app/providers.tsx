'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ReduxProvider } from '@/store/redux-provider';
import { SocketProvider } from '@/contexts/socket-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AntdRegistry>
        <SocketProvider>{children}</SocketProvider>
      </AntdRegistry>
    </ReduxProvider>
  );
}
