import { PrismaClient } from "@prisma/client";
import { ReservationService } from "../src/modules/reservation/reservation.service";
import { createReservationSchema } from "../src/modules/reservation/reservation.validator";

const prisma = new PrismaClient();
const reservationService = new ReservationService(prisma);

async function main() {
  const restaurant = await prisma.restaurant.findFirst();
  const table = await prisma.table.findFirst({ where: { floor: { restaurantId: restaurant!.id } } });
  
  if (!restaurant || !table) {
    console.log("No restaurant or table found");
    return;
  }

  const payload = {
    restaurantId: restaurant.id,
    tableId: table.id,
    name: "Tanishka",
    phone: "12345", // Intentionally bad phone to see if Zod fails
    reservationTime: new Date().toISOString(),
    partySize: 2,
  };

  try {
    const input = createReservationSchema.parse(payload);
    const res = await reservationService.createReservation(input);
    console.log("Success:", res);
  } catch (error) {
    console.error("Failed:", error);
  }
}

main().finally(() => prisma.$disconnect());
