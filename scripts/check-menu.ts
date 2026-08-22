import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const items = await prisma.menuItem.findMany();
  console.log(JSON.stringify(items, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
