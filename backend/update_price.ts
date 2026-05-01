import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.service.updateMany({
    where: {
      name: 'Ironing & Folding'
    },
    data: {
      price: 10
    }
  });
  console.log(`Updated ${result.count} services.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
