import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { initializeSocket } from '@/lib/socket/socket-server';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: '.', customServer: true });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

const httpServer = createServer((req, res) => {
  const parsedUrl = parse(req.url || '/', true);
  handle(req, res, parsedUrl);
});

export const io = new SocketIOServer({ path: '/api/socket', cors: { origin: '*' } });
io.attach(httpServer);
initializeSocket(io);

app.prepare().then(() => httpServer.listen(PORT, () => console.log(`> Ready on http://localhost:${PORT}`)));

const shutdown = async () => {
  console.log('Shutting down gracefully...');

  if (io) {
    io.close();
    console.log('Socket.IO server closed.');
  }

  httpServer.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
