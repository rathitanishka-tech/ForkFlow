import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { defaultVegetarianMenu } from '../src/modules/menu/menu.defaults';

const prisma = new PrismaClient();

const artifactsDir = `C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\394666d8-879d-4e49-a1d4-14f458785af8`;
const publicMenuDir = path.join(process.cwd(), 'public', 'menu');

if (!fs.existsSync(publicMenuDir)) {
  fs.mkdirSync(publicMenuDir, { recursive: true });
}

async function main() {
  console.log("Copying images to public directory...");
  for (const item of defaultVegetarianMenu) {
    const imageFile = item.image.replace('/menu/', '');
    const srcPath = path.join(artifactsDir, imageFile);
    const destPath = path.join(publicMenuDir, imageFile);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${imageFile}`);
    } else {
      console.warn(`Warning: Image ${srcPath} not found`);
    }
  }

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
          image: item.image,
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
