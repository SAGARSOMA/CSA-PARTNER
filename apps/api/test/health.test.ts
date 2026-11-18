import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { testEnv } from './helpers/testEnv';

describe('GET /api/v1/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(createApp(testEnv())).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
    expect(typeof res.body.data.time).toBe('string');
  });
});
