import { PrismaClient } from '@prisma/client';
import { defaultVegetarianMenu } from '../src/modules/menu/menu.defaults';

const prisma = new PrismaClient();

async function main() {
  console.log("Fetching all restaurants...");
  const restaurants = await prisma.restaurant.findMany();
  console.log(`Found ${restaurants.length} restaurants.`);

  for (const restaurant of restaurants) {
    console.log(`Updating menu for restaurant: ${restaurant.name}`);
    
    // Insert/update new veg items
    for (const item of defaultVegetarianMenu) {
      await prisma.menuItem.upsert({
        where: {
          restaurantId_name: {
            restaurantId: restaurant.id,
            name: item.name,
          }
        },
        update: {},
        create: {
          restaurantId: restaurant.id,
          name: item.name,
          description: item.description,
          price: item.price,
          preparationTime: item.preparationTime,
          isVeg: item.isVeg,
          spiceLevel: item.spiceLevel,
          category: item.category,
          isAvailable: true
        }
      });
    }
    console.log(`Added/Verified 6 pure veg items for ${restaurant.name}.`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
