import { PrismaClient } from "@prisma/client";

import type { ReservationResponse } from "./reservation.types";
import type { CreateReservationInput } from "./reservation.validator";

export class ReservationService {
  constructor(private readonly prisma: PrismaClient) {}

  async createReservation(
    input: CreateReservationInput,
  ): Promise<ReservationResponse> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const restaurant = await tx.restaurant.findUnique({
          where: { id: input.restaurantId },
          select: { id: true },
        });

        if (!restaurant) {
          throw new Error("Restaurant not found");
        }

        const table = await tx.table.findUnique({
          where: { id: input.tableId },
          select: {
            id: true,
            floor: {
              select: {
                restaurantId: true,
              },
            },
          },
        });

        if (!table) {
          throw new Error("Table not found");
        }

        if (table.floor.restaurantId !== input.restaurantId) {
          throw new Error("Table does not belong to restaurant");
        }

        const guest = await tx.guest.upsert({
          where: { phone: input.phone },
          update: {
            name: input.name,
            email: input.email,
          },
          create: {
            name: input.name,
            phone: input.phone,
            email: input.email,
          },
          select: { id: true },
        });

        const existingReservation = await tx.reservation.findFirst({
          where: {
            tableId: input.tableId,
            reservationDate: input.reservationDate,
            status: { notIn: ["CANCELLED"] },
          },
          select: { id: true },
        });

        if (existingReservation) {
          throw new Error("Table already reserved");
        }

        const createdReservation = await tx.reservation.create({
          data: {
            restaurantId: input.restaurantId,
            tableId: input.tableId,
            guestId: guest.id,
            customerName: input.name,
            phone: input.phone,
            guests: input.guests,
            reservationDate: input.reservationDate,
            occasion: input.occasion,
            status: "PENDING",
          },
        });

        return {
          id: createdReservation.id,
          restaurantId: createdReservation.restaurantId,
          tableId: createdReservation.tableId,
          guestId: createdReservation.guestId,
          customerName: createdReservation.customerName,
          phone: createdReservation.phone,
          reservationDate: createdReservation.reservationDate,
          guests: createdReservation.guests,
          occasion: createdReservation.occasion,
          status: createdReservation.status as ReservationResponse["status"],
          createdAt: createdReservation.createdAt,
          updatedAt: createdReservation.updatedAt,
        };
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Table already reserved"
      ) {
        throw error;
      }

      throw error;
    }
  }
}
