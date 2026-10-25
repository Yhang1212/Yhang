import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);

    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        passwordHash,
        role: 'ADMIN',
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
