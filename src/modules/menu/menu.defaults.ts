import { SpiceLevel } from '@prisma/client';

export const defaultVegetarianMenu = [
  {
    name: "Paneer Butter Masala",
    description: "Rich tomato gravy with fresh paneer cubes.",
    price: 349,
    preparationTime: 20,
    isVeg: true,
    spiceLevel: SpiceLevel.MILD,
    category: "Main Course"
  },
  {
    name: "Vegetable Biryani",
    description: "Aromatic basmati rice cooked with fresh vegetables and spices.",
    price: 299,
    preparationTime: 25,
    isVeg: true,
    spiceLevel: SpiceLevel.MEDIUM,
    category: "Main Course"
  },
  {
    name: "Margherita Pizza",
    description: "Classic pizza with fresh basil and mozzarella.",
    price: 399,
    preparationTime: 15,
    isVeg: true,
    spiceLevel: SpiceLevel.NONE,
    category: "Pizza"
  },
  {
    name: "Dal Makhani",
    description: "Slow-cooked black lentils in a creamy, rich gravy.",
    price: 249,
    preparationTime: 20,
    isVeg: true,
    spiceLevel: SpiceLevel.MILD,
    category: "Main Course"
  },
  {
    name: "Garlic Naan",
    description: "Freshly baked Indian bread topped with minced garlic and butter.",
    price: 79,
    preparationTime: 10,
    isVeg: true,
    spiceLevel: SpiceLevel.NONE,
    category: "Breads"
  },
  {
    name: "Mango Lassi",
    description: "Sweet and thick yogurt drink blended with fresh mangoes.",
    price: 149,
    preparationTime: 5,
    isVeg: true,
    spiceLevel: SpiceLevel.NONE,
    category: "Beverages"
  }
];
