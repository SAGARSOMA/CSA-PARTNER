import { parseEnv, type Env } from '../../src/config/env';

export const validSource: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  PORT: '4000',
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/csa_test',
  JWT_ACCESS_SECRET: 'a'.repeat(32),
  DATA_ENCRYPTION_KEY: Buffer.alloc(32, 1).toString('base64'),
  CORS_ORIGINS: 'http://localhost:3000',
  COOKIE_DOMAIN: '',
  S3_BUCKET: 'test-bucket',
  S3_REGION: 'ap-south-1',
  AWS_ACCESS_KEY_ID: 'test',
  AWS_SECRET_ACCESS_KEY: 'test',
  MSG91_AUTH_KEY: 'test',
  MSG91_TEMPLATE_ID: 'test',
  MSG91_SENDER_ID: 'test',
  SEED_SUPER_ADMIN_EMAIL: 'admin@example.com',
  SEED_SUPER_ADMIN_PASSWORD: 'longenoughpassword',
};

export function testEnv(): Env {
  return parseEnv(validSource);
}
