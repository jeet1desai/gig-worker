import { NextRequest, NextResponse } from 'next/server';
import { Server } from 'socket.io';

import { initializeSocket } from '@/lib/socket/socket-server';

let io: any = null;

const initializeSocketIO = (req: any, res: any) => {
  if (!io) {
    try {
      io = new Server({
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
      });

      initializeSocket(io);

      if (!res.socket?.server.io) {
        res.socket.server.io = io;
      }
    } catch (error) {
      console.error('Failed to initialize Socket.IO:', error);
      throw error;
    }
  }

  return io;
};

export async function GET(req: NextRequest) {
  try {
    return new NextResponse(JSON.stringify({ status: 'success' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Socket.IO error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to initialize Socket.IO' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export function getSocketServer() {
  return io;
}

export { initializeSocketIO };
