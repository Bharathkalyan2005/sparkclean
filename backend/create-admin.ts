import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('SparkClean@2026', 12);

  await prisma.user.upsert({
    where : { email: 'Welcome@vrcpvtltd.com' },
    update: { 
      role: 'ADMIN',
      passwordHash: hashedPassword
    },
    create: {
      email        : 'Welcome@vrcpvtltd.com',
      fullName     : 'SparkClean Admin',
      phone        : '9392420643',
      passwordHash : hashedPassword,
      role         : 'ADMIN',
      city         : 'India',
      isActive     : true,
    }
  })
  console.log('✅ Admin created: Welcome@vrcpvtltd.com')
}

createAdmin()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })