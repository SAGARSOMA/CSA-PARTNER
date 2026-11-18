import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import { runSeed, SETTING_DEFAULTS, SAMPLE_AREAS } from '../../prisma/seed';
import { createTestPrisma } from './helpers';

const options = { adminEmail: 'seed-test@example.com', adminPassword: 'a-long-test-password' };

describe('seed', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = createTestPrisma();
    await prisma.adminSetting.deleteMany();
    await prisma.adminUser.deleteMany();
    await prisma.area.deleteMany();
    await prisma.city.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('runs twice without error and without duplicates', async () => {
    await runSeed(prisma, options);
    await runSeed(prisma, options);

    expect(await prisma.city.count()).toBe(1);
    expect(await prisma.area.count()).toBe(SAMPLE_AREAS.length);
    expect(await prisma.adminSetting.count()).toBe(Object.keys(SETTING_DEFAULTS).length);
    expect(await prisma.adminUser.count({ where: { email: options.adminEmail } })).toBe(1);
  });

  it('stores an argon2id hash, never the plain password', async () => {
    const admin = await prisma.adminUser.findUnique({ where: { email: options.adminEmail } });
    expect(admin?.role).toBe('SUPER_ADMIN');
    expect(admin?.cityId).toBeNull();
    expect(admin?.passwordHash.startsWith('$argon2id$')).toBe(true);
  });

  it('does not overwrite a setting changed by the owner', async () => {
    await prisma.adminSetting.update({ where: { key: 'geo_radius_m' }, data: { value: '300' } });
    await runSeed(prisma, options);
    const row = await prisma.adminSetting.findUnique({ where: { key: 'geo_radius_m' } });
    expect(row?.value).toBe('300');
  });
});
