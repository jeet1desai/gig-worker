import { Server, Socket } from 'socket.io';

type IOServer = InstanceType<typeof Server>;

type UserSockets = Map<string, Set<string>>;
export const users: UserSockets = new Map();

export function emitToUser(io: IOServer, userId: string, event: string, data: unknown) {
  const userSockets = users.get(userId);
  if (userSockets) {
    userSockets.forEach((socketId) => {
      io.to(socketId).emit(event, data);
    });
  }
}

export function initializeSocket(io: IOServer) {
  console.log('Initializing Socket.IO server...');

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('register', (userId: string) => {
      if (!users.has(userId)) {
        users.set(userId, new Set());
      }
      users.get(userId)?.add(socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);

      for (const [userId, socketSet] of users.entries()) {
        if (socketSet.has(socket.id)) {
          socketSet.delete(socket.id);
          if (socketSet.size === 0) {
            users.delete(userId);
          }
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  console.log('Socket.IO server initialized');
}
