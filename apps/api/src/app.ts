import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import type { Env } from './config/env';
import { logger } from './lib/logger';
import { sendData } from './lib/response';
import { AppError } from './lib/errors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export function createApp(env: Env): Express {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.CORS_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          callback(new AppError('FORBIDDEN', 403, 'Origin not allowed'));
        }
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  app.get('/api/v1/health', (_req, res) => {
    sendData(res, { status: 'ok', time: new Date().toISOString() });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
