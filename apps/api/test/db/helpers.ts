import { PrismaClient } from '@prisma/client';

function normalizeUrl(raw: string): string {
  return raw
    .trim()
    .replace(/^[A-Za-z_]+=/, '')
    .replace(/^["']|["']$/g, '')
    .trim();
}

export function createTestPrisma(): PrismaClient {
  const raw = process.env['TEST_DATABASE_URL'];
  if (!raw) {
    throw new Error('TEST_DATABASE_URL is not set');
  }
  const url = normalizeUrl(raw);
  if (!/^postgres(ql)?:\/\//.test(url)) {
    throw new Error(
      `TEST_DATABASE_URL is malformed (length ${raw.length}); it must start with postgresql://`,
    );
  }
  return new PrismaClient({ datasources: { db: { url } } });
}
