import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const updates = [
    {
      oldName: "Capsicum Pizza",
      newName: "Paneer Butter Masala",
      category: "Main Course",
      description: "Rich tomato gravy with fresh paneer cubes.",
    },
    {
      oldName: "Chicken Biryani",
      newName: "Veg Hakka Noodles",
      category: "Chinese",
      description: "Stir-fried noodles with fresh vegetables.",
    },
    {
      oldName: "Chicken Burger",
      newName: "Classic Chicken Burger",
      category: "Burgers",
      description: "Crispy chicken burger with lettuce and mayo.",
    },
    {
      oldName: "Chicken Wings",
      newName: "Chicken Tikka",
      category: "Starters",
      description: "Charcoal grilled chicken tikka.",
    },
    {
      oldName: "Chocolate Brownie",
      newName: "Veg Fried Rice",
      category: "Chinese",
      description: "Aromatic fried rice tossed with vegetables.",
    },
    {
      oldName: "Cold Coffee",
      newName: "Cold Coffee",
      category: "Beverages",
      description: "Chilled coffee blended with ice cream.",
    },
    {
      oldName: "Farmhouse Pizza",
      newName: "Veg Platter",
      category: "Starters",
      description: "Assorted crispy snacks served with dips.",
    },
    {
      oldName: "Margherita Pizza",
      newName: "Paneer Chilli",
      category: "Chinese",
      description: "Spicy paneer tossed with peppers and onions.",
    },
    {
      oldName: "Paneer Tikka",
      newName: "Paneer Tikka",
      category: "Starters",
      description: "Charcoal grilled paneer cubes.",
    },
    {
      oldName: "Veg Burger",
      newName: "Grilled Veg Sandwich",
      category: "Snacks",
      description: "Grilled vegetable sandwich with cheese.",
    },
    {
      oldName: "White Sauce Pasta",
      newName: "Creamy White Sauce Pasta",
      category: "Pasta",
      description: "Penne pasta tossed in creamy white sauce.",
    },
  ];

  for (const item of updates) {
    await prisma.menuItem.updateMany({
      where: {
        name: item.oldName,
      },
      data: {
        name: item.newName,
        category: item.category,
        description: item.description,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
