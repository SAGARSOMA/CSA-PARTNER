import { PrismaClient } from '@prisma/client';
import { argon2id, hash } from 'argon2';

export const SETTING_DEFAULTS: Record<string, string> = {
  geo_radius_m: '200',
  gps_accuracy_max_m: '100',
  checkin_window_before_min: '60',
  late_grace_min: '15',
  travel_buffer_minutes: '60',
  waitlist_offer_minutes_far: '60',
  waitlist_offer_minutes_mid: '30',
  waitlist_offer_minutes_near: '15',
  drop_free_hours: '24',
  late_drop_strike_points: '1',
  late_drop_fine_paise: '0',
  no_show_strike_points: '2',
  no_show_fine_paise: '0',
  strike_suspend_threshold: '3',
  strike_window_days: '90',
  overtime_rate_per_hour_paise: '0',
  referral_bonus_paise: '0',
  referral_max_referrals: '20',
  referral_active_days: '30',
  referral_bonus_max_events: '0',
  default_apply_deadline_hours: '3',
  invoice_prefix: 'CSA',
  invoice_gst_percent: '0',
  company_name: '',
  company_address: '',
  company_gstin: '',
  company_phone: '',
  company_bank_details: '',
};

export const SAMPLE_AREAS = [
  'Madhapur',
  'Gachibowli',
  'Kondapur',
  'Kukatpally',
  'Banjara Hills',
  'Jubilee Hills',
  'Ameerpet',
  'Secunderabad',
];

export interface SeedOptions {
  adminEmail: string;
  adminPassword: string;
}

export async function runSeed(prisma: PrismaClient, options: SeedOptions): Promise<void> {
  const city = await prisma.city.upsert({
    where: { name: 'Hyderabad' },
    update: {},
    create: { name: 'Hyderabad' },
  });

  for (const name of SAMPLE_AREAS) {
    await prisma.area.upsert({
      where: { cityId_name: { cityId: city.id, name } },
      update: {},
      create: { cityId: city.id, name },
    });
  }

  for (const [key, value] of Object.entries(SETTING_DEFAULTS)) {
    await prisma.adminSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  const existing = await prisma.adminUser.findUnique({ where: { email: options.adminEmail } });
  if (!existing) {
    const passwordHash = await hash(options.adminPassword, { type: argon2id });
    await prisma.adminUser.create({
      data: {
        name: 'Super Admin',
        email: options.adminEmail,
        passwordHash,
        role: 'SUPER_ADMIN',
      },
    });
  }
}

async function main(): Promise<void> {
  const adminEmail = process.env['SEED_SUPER_ADMIN_EMAIL'];
  const adminPassword = process.env['SEED_SUPER_ADMIN_PASSWORD'];
  if (!process.env['DATABASE_URL'] || !adminEmail || !adminPassword) {
    throw new Error(
      'DATABASE_URL, SEED_SUPER_ADMIN_EMAIL and SEED_SUPER_ADMIN_PASSWORD are required',
    );
  }
  if (adminPassword.length < 10) {
    throw new Error('SEED_SUPER_ADMIN_PASSWORD must be at least 10 characters');
  }
  const prisma = new PrismaClient();
  try {
    await runSeed(prisma, { adminEmail, adminPassword });
    console.log('Seed completed');
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((e: unknown) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
