import { PrismaClient, SpiceLevel } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const artifactsDir = `C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\394666d8-879d-4e49-a1d4-14f458785af8`;
const publicMenuDir = path.join(process.cwd(), 'public', 'menu');

if (!fs.existsSync(publicMenuDir)) {
  fs.mkdirSync(publicMenuDir, { recursive: true });
}

const newItems = [
  {
    name: "Paneer Butter Masala",
    description: "Rich tomato gravy with fresh paneer cubes.",
    price: 349,
    preparationTime: 20,
    isVeg: true,
    spiceLevel: SpiceLevel.MILD,
    category: "Main Course",
    imageFile: "paneer_butter_masala_1787421655976.jpg"
  },
  {
    name: "Vegetable Biryani",
    description: "Aromatic basmati rice cooked with fresh vegetables and spices.",
    price: 299,
    preparationTime: 25,
    isVeg: true,
    spiceLevel: SpiceLevel.MEDIUM,
    category: "Main Course",
    imageFile: "veg_biryani_1787421668704.jpg"
  },
  {
    name: "Margherita Pizza",
    description: "Classic pizza with fresh basil and mozzarella.",
    price: 399,
    preparationTime: 15,
    isVeg: true,
    spiceLevel: SpiceLevel.NONE,
    category: "Pizza",
    imageFile: "margherita_pizza_1787421680276.jpg"
  },
  {
    name: "Dal Makhani",
    description: "Slow-cooked black lentils in a creamy, rich gravy.",
    price: 249,
    preparationTime: 20,
    isVeg: true,
    spiceLevel: SpiceLevel.MILD,
    category: "Main Course",
    imageFile: "dal_makhani_1787421693424.jpg"
  },
  {
    name: "Garlic Naan",
    description: "Freshly baked Indian bread topped with minced garlic and butter.",
    price: 79,
    preparationTime: 10,
    isVeg: true,
    spiceLevel: SpiceLevel.NONE,
    category: "Breads",
    imageFile: "garlic_naan_1787421707528.jpg"
  },
  {
    name: "Mango Lassi",
    description: "Sweet and thick yogurt drink blended with fresh mangoes.",
    price: 149,
    preparationTime: 5,
    isVeg: true,
    spiceLevel: SpiceLevel.NONE,
    category: "Beverages",
    imageFile: "mango_lassi_1787421719291.jpg"
  }
];

async function main() {
  console.log("Copying images to public directory...");
  for (const item of newItems) {
    const srcPath = path.join(artifactsDir, item.imageFile);
    const destPath = path.join(publicMenuDir, item.imageFile);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${item.imageFile}`);
    } else {
      console.warn(`Warning: Image ${srcPath} not found`);
    }
  }

  console.log("Fetching all restaurants...");
  const restaurants = await prisma.restaurant.findMany();
  console.log(`Found ${restaurants.length} restaurants.`);

  for (const restaurant of restaurants) {
    console.log(`Updating menu for restaurant: ${restaurant.name}`);
    
    // Delete existing menu items
    await prisma.menuItem.deleteMany({
      where: { restaurantId: restaurant.id }
    });
    console.log("Deleted old menu items.");

    // Insert new veg items
    for (const item of newItems) {
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          name: item.name,
          description: item.description,
          price: item.price,
          preparationTime: item.preparationTime,
          isVeg: item.isVeg,
          spiceLevel: item.spiceLevel,
          category: item.category,
          image: `/menu/${item.imageFile}`,
          isAvailable: true
        }
      });
    }
    console.log(`Added 6 pure veg items to ${restaurant.name}.`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
