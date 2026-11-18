import { PrismaClient } from '@prisma/client';

export function createTestPrisma(): PrismaClient {
  const url = process.env['TEST_DATABASE_URL']?.trim();
  if (!url) {
    throw new Error('TEST_DATABASE_URL is not set');
  }
  return new PrismaClient({ datasources: { db: { url } } });
}
