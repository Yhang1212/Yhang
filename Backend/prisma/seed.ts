import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const development = process.env.NODE_ENV === 'development';
  const production = process.env.NODE_ENV === 'production';
  if (!development && !production) {
    throw new Error('NODE_ENV must be explicitly set to development or production before seeding.');
  }

  const email = process.env.ADMIN_EMAIL || (development ? 'admin@example.com' : undefined);
  const password = process.env.ADMIN_PASSWORD || (development ? 'admin123' : undefined);
  if (!email || !password || (production && password.length < 12)) {
    throw new Error('Set ADMIN_EMAIL and a strong ADMIN_PASSWORD (at least 12 characters) before seeding in production.');
  }

  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  if (!existingAdmin) {
    await prisma.user.create({ data: {
      email, name: 'HAILANG Administrator',
      passwordHash: await bcrypt.hash(password, 12), role: 'ADMIN',
    } });
  }

  const categories = [
    { name: 'Refrigerators', slug: 'refrigerators', description: 'HAILANG refrigerator products.' },
    { name: 'Chest Freezers', slug: 'chest-freezers', description: 'HAILANG chest freezer products.' },
    { name: 'Ice Makers', slug: 'ice-makers', description: 'HAILANG ice maker products.' },
  ];
  for (const category of categories) {
    await prisma.category.upsert({ where: { slug: category.slug }, update: {}, create: category });
  }
}

main()
  .catch((error) => { console.error(error); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
