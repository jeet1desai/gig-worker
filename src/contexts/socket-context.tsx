'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { socketManager } from '@/lib/socket/socket-manager';

interface SocketContextType {
  socket: ReturnType<typeof socketManager.getSocket>;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Omit<SocketContextType, 'socket'>>({
    isConnected: false,
  });
  const [socket, setSocket] = useState<ReturnType<typeof socketManager.getSocket>>(null);

  useEffect(() => {
    const socketInstance = socketManager.getSocket();
    setSocket(socketInstance);

    setState((prev) => ({
      ...prev,
      isConnected: socketManager.getIsConnected(),
    }));

    const unsubscribe = socketManager.subscribe(() => {
      setState((prev) => ({
        ...prev,
        isConnected: socketManager.getIsConnected(),
      }));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <SocketContext.Provider value={{ socket, ...state }}>{children}</SocketContext.Provider>;
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
