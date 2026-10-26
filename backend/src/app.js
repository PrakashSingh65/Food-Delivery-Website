import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import apiRoutes from './routes/index.js';
import { notFound } from './middleware/notFoundMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { env } from './config/env.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Performance & Body Parsing Middlewares
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Health Check Endpoint (essential for Docker & orchestration)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'food-delivery-backend',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1', apiRoutes);

// 404 & Centralized Error Handler
app.use(notFound);
app.use(errorHandler);

export default app;
