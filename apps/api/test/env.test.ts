import { describe, it, expect } from 'vitest';
import { parseEnv } from '../src/config/env';
import { validSource } from './helpers/testEnv';

describe('parseEnv', () => {
  it('accepts a valid environment', () => {
    const env = parseEnv(validSource);
    expect(env.PORT).toBe(4000);
    expect(env.CORS_ORIGINS).toEqual(['http://localhost:3000']);
  });

  it('fails with a clear message when a variable is missing', () => {
    const { DATABASE_URL: _removed, ...rest } = validSource;
    expect(() => parseEnv(rest)).toThrow(/DATABASE_URL/);
  });

  it('rejects an encryption key that is not 32 bytes', () => {
    const bad = { ...validSource, DATA_ENCRYPTION_KEY: 'c2hvcnQ=' };
    expect(() => parseEnv(bad)).toThrow(/DATA_ENCRYPTION_KEY/);
  });

  it('rejects a short JWT secret', () => {
    const bad = { ...validSource, JWT_ACCESS_SECRET: 'short' };
    expect(() => parseEnv(bad)).toThrow(/JWT_ACCESS_SECRET/);
  });
});
