'use client';

import { useEffect, useMemo } from 'react';
import { useSocket } from '@/contexts/socket-context';

type SocketEventCallback = (...args: any[]) => void;

export const useSocketEvent = (eventName: string, callback: SocketEventCallback) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(eventName, callback);

    return () => {
      socket.off(eventName, callback);
    };
  }, [socket, eventName, callback]);
};

export const useSocketEmit = () => {
  const { socket } = useSocket();

  const emit = useMemo(() => {
    return (eventName: string, ...args: any[]) => {
      if (!socket) {
        console.warn('Socket not connected');
        return;
      }
      socket.emit(eventName, ...args);
    };
  }, [socket]);

  return emit;
};

export const useSocketConnection = () => {
  const { socket, isConnected } = useSocket();

  const registerUser = (userId: string) => {
    if (!socket || !isConnected) return;
    socket.emit('register', userId);
  };

  return {
    isConnected,
    socketId: socket?.id,
    registerUser
  };
};
