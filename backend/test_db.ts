import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    const count = await prisma.user.count();
    console.log('Successfully connected. User count:', count);

    // Try to find a user or create a fake one
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        fullName: 'Test User',
        passwordHash: 'testhash'
      }
    });
    console.log('Upsert worked:', testUser.email);
  } catch (e) {
    console.error('Error connecting to DB:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
