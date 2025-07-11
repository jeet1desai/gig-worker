'use client';

import { useEffect, useState } from 'react';

import { useSocket } from '@/contexts/socket-context';

export default function ClientSocketWrapper() {
  const { isConnected, socket } = useSocket();
  const [showStatus, setShowStatus] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setShowStatus(true);
    }
  }, []);

  useEffect(() => {
    if (socket && !isInitialized) {
      setIsInitialized(true);

      const currentUserId = '5';
      if (currentUserId) {
        socket.emit('register', currentUserId);
      }
    }
  }, [socket, isInitialized]);

  if (!showStatus) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm text-white shadow-lg">
      <div
        className={`mr-2 h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
      ></div>
      <span>Socket: {isConnected ? 'Connected' : 'Disconnected'}</span>
    </div>
  );
}
