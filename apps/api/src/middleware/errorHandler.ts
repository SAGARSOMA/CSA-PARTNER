import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../lib/errors';
import { errorBody } from '../lib/response';
import { logger } from '../lib/logger';

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json(errorBody('NOT_FOUND', 'Route not found'));
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.httpStatus).json(errorBody(err.code, err.message, err.details));
    return;
  }
  if (err instanceof ZodError) {
    res.status(422).json(errorBody('VALIDATION_ERROR', 'Invalid request', err.issues));
    return;
  }
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(422).json(errorBody('VALIDATION_ERROR', 'Invalid JSON body'));
    return;
  }
  logger.error({ err, path: req.path }, 'Unhandled error');
  res.status(500).json(errorBody('INTERNAL', 'Something went wrong'));
};
