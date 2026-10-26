import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initSocket } from './sockets/socketHandler.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

initSocket(io);

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    server.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`REST API: http://localhost:${env.PORT}/api/v1`);
      logger.info(`Health check: http://localhost:${env.PORT}/health`);
      logger.info(`WebSockets initialized on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', { error: error.message });
    process.exit(1);
  }
};

// Graceful Shutdown
const shutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();
