import { Prisma, PrismaClient } from "@prisma/client";

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

        const existingReservation = await tx.reservation.findUnique({
          where: {
            tableId_reservationTime: {
              tableId: input.tableId,
              reservationTime: input.reservationTime,
            },
          },
          select: { id: true },
        });

        if (existingReservation) {
          throw new Error("Table already reserved");
        }

        return tx.reservation.create({
          data: {
            restaurantId: input.restaurantId,
            tableId: input.tableId,
            guestId: guest.id,
            reservationTime: input.reservationTime,
            partySize: input.partySize,
            occasion: input.occasion,
            seatingPreference: input.seatingPreference,
            noisePreference: input.noisePreference,
            notes: input.notes,
          },
        });
      });
    } catch (error) {
      if (this.isReservationConflict(error)) {
        throw new Error("Table already reserved");
      }

      throw error;
    }
  }

  private isReservationConflict(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      Array.isArray(error.meta?.target) &&
      error.meta.target.includes("tableId") &&
      error.meta.target.includes("reservationTime")
    );
  }
}
