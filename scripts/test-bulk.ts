import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  const restaurantId = "123";
  await prisma.$transaction([
    prisma.orderItem.deleteMany({ where: { order: { restaurantId } } }),
    prisma.order.deleteMany({ where: { restaurantId } }),
    prisma.diningSession.deleteMany({ where: { restaurantId } }),
    prisma.reservation.deleteMany({ where: { restaurantId } }),
    prisma.menuItem.deleteMany({ where: { restaurantId } }),
    prisma.table.deleteMany({ where: { floor: { restaurantId } } }),
    prisma.floor.deleteMany({ where: { restaurantId } }),
    prisma.restaurant.delete({ where: { id: restaurantId } }),
    prisma.businessMembership.deleteMany({ where: { businessId: "abc" } }),
    prisma.business.delete({ where: { id: "abc" } })
  ]);
}
