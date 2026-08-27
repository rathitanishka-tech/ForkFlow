import { SpiceLevel } from '@prisma/client';

export const defaultVegetarianMenu = [
  {
    name: "Paneer Butter Masala",
    description: "Rich tomato gravy with fresh paneer cubes.",
    price: 349,
    preparationTime: 20,
    isVeg: true,
    spiceLevel: SpiceLevel.MILD,
    category: "Main Course",
    image: "/menu/paneer_butter_masala_1787421655976.jpg"
  },
  {
    name: "Vegetable Biryani",
    description: "Aromatic basmati rice cooked with fresh vegetables and spices.",
    price: 299,
    preparationTime: 25,
    isVeg: true,
    spiceLevel: SpiceLevel.MEDIUM,
    category: "Main Course",
    image: "/menu/veg_biryani_1787421668704.jpg"
  },
  {
    name: "Margherita Pizza",
    description: "Classic pizza with fresh basil and mozzarella.",
    price: 399,
    preparationTime: 15,
    isVeg: true,
    spiceLevel: SpiceLevel.NONE,
    category: "Pizza",
    image: "/menu/margherita_pizza_1787421680276.jpg"
  },
  {
    name: "Dal Makhani",
    description: "Slow-cooked black lentils in a creamy, rich gravy.",
    price: 249,
    preparationTime: 20,
    isVeg: true,
    spiceLevel: SpiceLevel.MILD,
    category: "Main Course",
    image: "/menu/dal_makhani_1787421693424.jpg"
  },
  {
    name: "Garlic Naan",
    description: "Freshly baked Indian bread topped with minced garlic and butter.",
    price: 79,
    preparationTime: 10,
    isVeg: true,
    spiceLevel: SpiceLevel.NONE,
    category: "Breads",
    image: "/menu/garlic_naan_1787421707528.jpg"
  },
  {
    name: "Mango Lassi",
    description: "Sweet and thick yogurt drink blended with fresh mangoes.",
    price: 149,
    preparationTime: 5,
    isVeg: true,
    spiceLevel: SpiceLevel.NONE,
    category: "Beverages",
    image: "/menu/mango_lassi_1787421719291.jpg"
  }
];
