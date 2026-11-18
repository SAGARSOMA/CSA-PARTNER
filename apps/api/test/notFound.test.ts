import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { testEnv } from './helpers/testEnv';

describe('unknown route', () => {
  it('returns NOT_FOUND error envelope', async () => {
    const res = await request(createApp(testEnv())).get('/api/v1/nope');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
