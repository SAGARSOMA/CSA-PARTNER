import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import { createTestPrisma } from './helpers';

const cases: Array<{ name: string; constraint: string; sql: string }> = [
  {
    name: 'JobPost.slots must be above 0',
    constraint: 'JobPost_slots_positive',
    sql: `INSERT INTO "JobPost" ("bookingId","role","slots","clientRatePerHead","associatePay","reportingTime","applyDeadline")
          VALUES (gen_random_uuid(),'SERVER',0,100,100,now(),now())`,
  },
  {
    name: 'Booking.endTime must be after startTime',
    constraint: 'Booking_end_after_start',
    sql: `INSERT INTO "Booking" ("clientId","cityId","eventType","eventName","venueName","venueAddress","lat","lng","startTime","endTime","createdById")
          VALUES (gen_random_uuid(),gen_random_uuid(),'PARTY','e','v','a',17.4,78.4,now(),now() - interval '1 hour',gen_random_uuid())`,
  },
  {
    name: 'LedgerEntry.amountPaise must not be 0',
    constraint: 'LedgerEntry_amount_nonzero',
    sql: `INSERT INTO "LedgerEntry" ("associateId","type","amountPaise")
          VALUES (gen_random_uuid(),'ADJUSTMENT',0)`,
  },
  {
    name: 'Payout.amountPaise must be above 0',
    constraint: 'Payout_amount_positive',
    sql: `INSERT INTO "Payout" ("associateId","amountPaise","method","paidById")
          VALUES (gen_random_uuid(),0,'UPI',gen_random_uuid())`,
  },
  {
    name: 'Rating.stars must be between 1 and 5',
    constraint: 'Rating_stars_range',
    sql: `INSERT INTO "Rating" ("assignmentId","associateId","bookingId","stars","enteredById")
          VALUES (gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),6,gen_random_uuid())`,
  },
  {
    name: 'Penalty.amountPaise must be 0 or more',
    constraint: 'Penalty_amount_nonneg',
    sql: `INSERT INTO "Penalty" ("associateId","type","amountPaise","reason")
          VALUES (gen_random_uuid(),'OTHER',-1,'r')`,
  },
  {
    name: 'Penalty.strikePoints must be 0 or more',
    constraint: 'Penalty_strike_nonneg',
    sql: `INSERT INTO "Penalty" ("associateId","type","strikePoints","reason")
          VALUES (gen_random_uuid(),'OTHER',-1,'r')`,
  },
];

describe('database CHECK constraints', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = createTestPrisma();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it.each(cases)('rejects: $name', async ({ constraint, sql }) => {
    await expect(prisma.$executeRawUnsafe(sql)).rejects.toThrow(new RegExp(constraint));
  });
});
