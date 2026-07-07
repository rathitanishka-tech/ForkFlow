import {
  PrismaClient,
  PropertyType,
  TableShape,
  TableStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.diningSession.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.table.deleteMany();
  await prisma.floor.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.businessMembership.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  await prisma.business.create({
    data: {
      name: "ForkFlow Hospitality",
      slug: "forkflow-hospitality",
      restaurants: {
        create: {
          name: "Downtown Restaurant",
          slug: "downtown",
          description: "Premium restaurant",
          phone: "+919876543210",
          email: "contact@forkflow.com",
          address: "MG Road, Pune",
          timezone: "Asia/Kolkata",
          currency: "INR",
          propertyType: PropertyType.OWNED,
          parkingAvailable: true,
          isActive: true,
          floors: {
            create: {
              name: "Ground Floor",
              level: 0,
              width: 120,
              height: 80,
              tables: {
                create: [
                  {
                    number: "T1",
                    capacity: 2,
                    shape: TableShape.ROUND,
                    status: TableStatus.AVAILABLE,
                    xPosition: 18,
                    yPosition: 18,
                    rotation: 0,
                    isActive: true,
                  },
                  {
                    number: "T2",
                    capacity: 2,
                    shape: TableShape.ROUND,
                    status: TableStatus.AVAILABLE,
                    xPosition: 18,
                    yPosition: 42,
                    rotation: 0,
                    isActive: true,
                  },
                  {
                    number: "T3",
                    capacity: 4,
                    shape: TableShape.ROUND,
                    status: TableStatus.AVAILABLE,
                    xPosition: 44,
                    yPosition: 18,
                    rotation: 0,
                    isActive: true,
                  },
                  {
                    number: "T4",
                    capacity: 4,
                    shape: TableShape.ROUND,
                    status: TableStatus.AVAILABLE,
                    xPosition: 44,
                    yPosition: 42,
                    rotation: 0,
                    isActive: true,
                  },
                  {
                    number: "T5",
                    capacity: 4,
                    shape: TableShape.ROUND,
                    status: TableStatus.AVAILABLE,
                    xPosition: 70,
                    yPosition: 18,
                    rotation: 0,
                    isActive: true,
                  },
                  {
                    number: "T6",
                    capacity: 4,
                    shape: TableShape.ROUND,
                    status: TableStatus.AVAILABLE,
                    xPosition: 70,
                    yPosition: 42,
                    rotation: 0,
                    isActive: true,
                  },
                  {
                    number: "T7",
                    capacity: 6,
                    shape: TableShape.ROUND,
                    status: TableStatus.AVAILABLE,
                    xPosition: 98,
                    yPosition: 18,
                    rotation: 0,
                    isActive: true,
                  },
                  {
                    number: "T8",
                    capacity: 6,
                    shape: TableShape.ROUND,
                    status: TableStatus.AVAILABLE,
                    xPosition: 98,
                    yPosition: 42,
                    rotation: 0,
                    isActive: true,
                  },
                  {
                    number: "T9",
                    capacity: 6,
                    shape: TableShape.ROUND,
                    status: TableStatus.AVAILABLE,
                    xPosition: 44,
                    yPosition: 66,
                    rotation: 0,
                    isActive: true,
                  },
                  {
                    number: "T10",
                    capacity: 6,
                    shape: TableShape.ROUND,
                    status: TableStatus.AVAILABLE,
                    xPosition: 76,
                    yPosition: 66,
                    rotation: 0,
                    isActive: true,
                  },
                ],
              },
            },
          },
        },
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
