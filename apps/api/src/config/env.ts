import { z } from 'zod';

const base64Key32 = z
  .string()
  .refine((v) => Buffer.from(v, 'base64').length === 32, {
    message: 'must be 32 bytes encoded as base64',
  });

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32, 'must be at least 32 characters'),
  DATA_ENCRYPTION_KEY: base64Key32,
  CORS_ORIGINS: z
    .string()
    .min(1)
    .transform((v) => v.split(',').map((s) => s.trim()).filter(Boolean)),
  COOKIE_DOMAIN: z.string().optional().default(''),
  S3_BUCKET: z.string().min(1),
  S3_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  MSG91_AUTH_KEY: z.string().min(1),
  MSG91_TEMPLATE_ID: z.string().min(1),
  MSG91_SENDER_ID: z.string().min(1),
  EXPO_ACCESS_TOKEN: z.string().optional(),
  OTP_TEST_NUMBERS: z.string().optional().default(''),
  SEED_SUPER_ADMIN_EMAIL: z.string().email(),
  SEED_SUPER_ADMIN_PASSWORD: z.string().min(10),
});

export type Env = z.infer<typeof schema>;

export function parseEnv(source: NodeJS.ProcessEnv): Env {
  const result = schema.safeParse(source);
  if (!result.success) {
    const lines = result.error.issues.map(
      (i) => `  - ${i.path.join('.')}: ${i.message}`,
    );
    throw new Error(`Invalid environment configuration:\n${lines.join('\n')}`);
  }
  return result.data;
}

let cached: Env | undefined;

export function getEnv(): Env {
  if (!cached) {
    cached = parseEnv(process.env);
  }
  return cached;
}
