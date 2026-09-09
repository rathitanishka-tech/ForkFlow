import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function testDelete() {
  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) {
    console.log("No restaurant found to delete.");
    return;
  }
  
  console.log(`Deleting restaurant: ${restaurant.id}`);
  
  try {
    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({ where: { order: { restaurantId: restaurant.id } } });
      await tx.order.deleteMany({ where: { restaurantId: restaurant.id } });
      await tx.diningSession.deleteMany({ where: { restaurantId: restaurant.id } });
      await tx.reservation.deleteMany({ where: { restaurantId: restaurant.id } });
      await tx.menuItem.deleteMany({ where: { restaurantId: restaurant.id } });
      
      const floors = await tx.floor.findMany({ where: { restaurantId: restaurant.id } });
      const floorIds = floors.map(f => f.id);
      
      await tx.table.deleteMany({ where: { floorId: { in: floorIds } } });
      await tx.floor.deleteMany({ where: { restaurantId: restaurant.id } });
      
      await tx.restaurant.delete({ where: { id: restaurant.id } });
      await tx.businessMembership.deleteMany({ where: { businessId: restaurant.businessId } });
      await tx.business.delete({ where: { id: restaurant.businessId } });
    });
    console.log("Deleted successfully.");
  } catch (error) {
    console.error("Deletion failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDelete();
