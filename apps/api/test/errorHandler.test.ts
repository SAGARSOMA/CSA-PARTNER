import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { z } from 'zod';
import { errorHandler } from '../src/middleware/errorHandler';
import { AppError } from '../src/lib/errors';

function appThatThrows(thrower: () => unknown) {
  const app = express();
  app.get('/boom', () => {
    thrower();
  });
  app.use(errorHandler);
  return app;
}

describe('errorHandler', () => {
  it('maps ZodError to VALIDATION_ERROR 422', async () => {
    const res = await request(
      appThatThrows(() => z.object({ a: z.string() }).parse({})),
    ).get('/boom');
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('maps AppError to its code and status', async () => {
    const res = await request(
      appThatThrows(() => {
        throw new AppError('CONFLICT', 409, 'Already exists');
      }),
    ).get('/boom');
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('hides internals for unknown errors', async () => {
    const res = await request(
      appThatThrows(() => {
        throw new Error('secret db password leaked');
      }),
    ).get('/boom');
    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('INTERNAL');
    expect(JSON.stringify(res.body)).not.toContain('secret');
  });
});
