import {
  DiningSessionStatus,
  Prisma,
  PrismaClient,
  ReservationStatus,
  TableStatus,
} from "@prisma/client";

import type { ReservationWithGuest } from "./reservation.types";
import type { CreateReservationInput, UpdateReservationInput } from "./reservation.validator";

/**
 * Machine-readable codes for expected business-rule failures in the
 * reservation -> dining session workflow, as opposed to unexpected
 * infrastructure errors (raw Prisma exceptions, network errors, etc).
 * Controllers/routes can safely surface `.message` to API consumers and
 * can switch on `.code` later if they want to map specific failures to
 * specific HTTP status codes.
 */
export const ReservationErrorCode = {
  RESERVATION_NOT_FOUND: "RESERVATION_NOT_FOUND",
  RESTAURANT_NOT_FOUND: "RESTAURANT_NOT_FOUND",
  TABLE_NOT_FOUND: "TABLE_NOT_FOUND",
  TABLE_RESTAURANT_MISMATCH: "TABLE_RESTAURANT_MISMATCH",
  TABLE_ALREADY_RESERVED: "TABLE_ALREADY_RESERVED",
  TABLE_ALREADY_OCCUPIED: "TABLE_ALREADY_OCCUPIED",
  INVALID_STATE_TRANSITION: "INVALID_STATE_TRANSITION",
  RESERVATION_ALREADY_SEATED: "RESERVATION_ALREADY_SEATED",
  RESERVATION_ALREADY_COMPLETED: "RESERVATION_ALREADY_COMPLETED",
  DINING_SESSION_ALREADY_EXISTS: "DINING_SESSION_ALREADY_EXISTS",
  DINING_SESSION_NOT_FOUND: "DINING_SESSION_NOT_FOUND",
  DINING_SESSION_ALREADY_CLOSED: "DINING_SESSION_ALREADY_CLOSED",
} as const;

export type ReservationErrorCode =
  (typeof ReservationErrorCode)[keyof typeof ReservationErrorCode];

/**
 * A well-formed, expected failure of a reservation business rule.
 * `error instanceof Error` still holds (route.ts's existing catch block
 * needs no changes), but callers that want to can also inspect `.code`.
 */
export class ReservationBusinessError extends Error {
  public readonly code: ReservationErrorCode;

  constructor(message: string, code: ReservationErrorCode) {
    super(message);
    this.name = "ReservationBusinessError";
    this.code = code;
  }
}

/**
 * Detects a Prisma unique-constraint violation (P2002) touching a specific
 * field, so DB-level race conditions can be translated into the same
 * business error a synchronous check would have produced, instead of
 * leaking raw Prisma internals ("Unique constraint failed on reservationId")
 * to callers.
 */
function isUniqueConstraintViolation(error: unknown, field: string): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return false;
  }
  if (error.code !== "P2002") {
    return false;
  }
  const target = (error.meta as { target?: string[] | string } | undefined)
    ?.target;
  if (Array.isArray(target)) {
    return target.includes(field);
  }
  if (typeof target === "string") {
    return target.includes(field);
  }
  return false;
}

const ACTIVE_RESERVATION_STATUSES: ReservationStatus[] = [
  ReservationStatus.PENDING,
  ReservationStatus.CONFIRMED,
  ReservationStatus.SEATED,
];

export class ReservationService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Retrieves all reservations for the given restaurant.
   * restaurantId is REQUIRED — no global queries.
   */
  async getReservations(restaurantId: string): Promise<ReservationWithGuest[]> {
    return this.prisma.reservation.findMany({
      where: {
        restaurantId,
      },
      include: {
        guest: true,
        table: true,
      },
      orderBy: {
        reservationTime: "desc",
      },
    });
  }

  async createReservation(
    input: CreateReservationInput,
  ): Promise<ReservationWithGuest> {
    return this.prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.findUnique({
        where: { id: input.restaurantId },
        select: { id: true },
      });

      if (!restaurant) {
        throw new ReservationBusinessError(
          "Restaurant not found",
          ReservationErrorCode.RESTAURANT_NOT_FOUND,
        );
      }

      const table = await tx.table.findUnique({
        where: { id: input.tableId },
        select: {
          id: true,
          capacity: true,
          isActive: true,
          floor: {
            select: {
              restaurantId: true,
            },
          },
        },
      });

      if (!table) {
        throw new ReservationBusinessError(
          "Table not found",
          ReservationErrorCode.TABLE_NOT_FOUND,
        );
      }

      if (table.floor.restaurantId !== input.restaurantId) {
        throw new ReservationBusinessError(
          "Table does not belong to restaurant",
          ReservationErrorCode.TABLE_RESTAURANT_MISMATCH,
        );
      }

      if (!table.isActive) {
        throw new ReservationBusinessError(
          "Table is not active",
          ReservationErrorCode.TABLE_NOT_FOUND, // Or a new error code, but NOT_FOUND works as it's not available
        );
      }

      if (table.capacity < input.partySize) {
        throw new ReservationBusinessError(
          "Party size exceeds table capacity",
          ReservationErrorCode.TABLE_RESTAURANT_MISMATCH, // Or a specific error
        );
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

      const reservationStart = new Date(input.reservationTime);
      const windowStart = new Date(reservationStart.getTime() - 2 * 60 * 60 * 1000);
      const windowEnd = new Date(reservationStart.getTime() + 2 * 60 * 60 * 1000);

      const existingReservation = await tx.reservation.findFirst({
        where: {
          tableId: input.tableId,
          reservationTime: {
            gt: windowStart,
            lt: windowEnd,
          },
          status: { in: ACTIVE_RESERVATION_STATUSES },
        },
        select: { id: true },
      });

      if (existingReservation) {
        throw new ReservationBusinessError(
          "Table already reserved for this time",
          ReservationErrorCode.TABLE_ALREADY_RESERVED,
        );
      }

      let createdReservation: ReservationWithGuest;
      try {
        createdReservation = await tx.reservation.create({
          data: {
            restaurantId: input.restaurantId,
            tableId: input.tableId,
            guestId: guest.id,
            partySize: input.partySize,
            reservationTime: input.reservationTime,
            occasion: input.occasion,
            status: ReservationStatus.PENDING,
          },
          include: {
            guest: true,
            table: true,
          },
        });
      } catch (error) {
        if (isUniqueConstraintViolation(error, "tableId")) {
          throw new ReservationBusinessError(
            "Table already reserved for this time",
            ReservationErrorCode.TABLE_ALREADY_RESERVED,
          );
        }
        throw error;
      }

      await tx.table.update({
        where: {
          id: input.tableId,
        },
        data: {
          status: TableStatus.RESERVED,
        },
      });

      return createdReservation;
    });
  }

  async confirmReservation(
    id: string,
    restaurantId: string,
  ): Promise<ReservationWithGuest> {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findFirst({
        where: { id, restaurantId },
        select: { id: true, status: true },
      });

      if (!reservation) {
        throw new ReservationBusinessError(
          "Reservation not found",
          ReservationErrorCode.RESERVATION_NOT_FOUND,
        );
      }

      if (reservation.status !== ReservationStatus.PENDING) {
        throw new ReservationBusinessError(
          `Cannot confirm a reservation with status ${reservation.status}. Only PENDING reservations can be confirmed.`,
          ReservationErrorCode.INVALID_STATE_TRANSITION,
        );
      }

      return tx.reservation.update({
        where: { id },
        data: {
          status: ReservationStatus.CONFIRMED,
        },
        include: {
          guest: true,
          table: true,
        },
      });
    });
  }

  async seatGuest(
    id: string,
    restaurantId: string,
  ): Promise<ReservationWithGuest> {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findFirst({
        where: { id, restaurantId },
        include: {
          diningSessions: true,
        },
      });

      if (!reservation) {
        throw new ReservationBusinessError(
          "Reservation not found",
          ReservationErrorCode.RESERVATION_NOT_FOUND,
        );
      }

      if (reservation.status === ReservationStatus.SEATED) {
        throw new ReservationBusinessError(
          "Reservation has already been seated",
          ReservationErrorCode.RESERVATION_ALREADY_SEATED,
        );
      }

      if (reservation.status !== ReservationStatus.CONFIRMED) {
        throw new ReservationBusinessError(
          `Cannot seat a reservation with status ${reservation.status}. Only CONFIRMED reservations can be seated.`,
          ReservationErrorCode.INVALID_STATE_TRANSITION,
        );
      }

      if (reservation.diningSessions) {
        throw new ReservationBusinessError(
          "A dining session already exists for this reservation",
          ReservationErrorCode.DINING_SESSION_ALREADY_EXISTS,
        );
      }

      const table = await tx.table.findUnique({
        where: { id: reservation.tableId },
        select: { id: true, status: true },
      });

      if (!table) {
        throw new ReservationBusinessError(
          "Table not found",
          ReservationErrorCode.TABLE_NOT_FOUND,
        );
      }

      if (table.status === TableStatus.OCCUPIED) {
        throw new ReservationBusinessError(
          "Table is already occupied",
          ReservationErrorCode.TABLE_ALREADY_OCCUPIED,
        );
      }

      try {
        await tx.diningSession.create({
          data: {
            restaurantId: reservation.restaurantId,
            tableId: reservation.tableId,
            reservationId: reservation.id,
            guestId: reservation.guestId,
            startedAt: new Date(),
            status: DiningSessionStatus.ACTIVE,
          },
        });
      } catch (error) {
        if (isUniqueConstraintViolation(error, "reservationId")) {
          throw new ReservationBusinessError(
            "A dining session already exists for this reservation",
            ReservationErrorCode.DINING_SESSION_ALREADY_EXISTS,
          );
        }
        throw error;
      }

      await tx.table.update({
        where: { id: reservation.tableId },
        data: {
          status: TableStatus.OCCUPIED,
        },
      });

      return tx.reservation.update({
        where: { id },
        data: {
          status: ReservationStatus.SEATED,
        },
        include: {
          guest: true,
          table: true,
        },
      });
    });
  }

  async completeDining(
    id: string,
    restaurantId: string,
  ): Promise<ReservationWithGuest> {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findFirst({
        where: { id, restaurantId },
        include: {
          diningSessions: true,
        },
      });

      if (!reservation) {
        throw new ReservationBusinessError(
          "Reservation not found",
          ReservationErrorCode.RESERVATION_NOT_FOUND,
        );
      }

      if (reservation.status === ReservationStatus.COMPLETED) {
        throw new ReservationBusinessError(
          "Reservation has already been completed",
          ReservationErrorCode.RESERVATION_ALREADY_COMPLETED,
        );
      }

      if (reservation.status !== ReservationStatus.SEATED) {
        throw new ReservationBusinessError(
          `Cannot complete dining for a reservation with status ${reservation.status}. Only SEATED reservations can be completed.`,
          ReservationErrorCode.INVALID_STATE_TRANSITION,
        );
      }

      const diningSession = reservation.diningSessions;

      if (!diningSession) {
        throw new ReservationBusinessError(
          "No dining session found for this reservation",
          ReservationErrorCode.DINING_SESSION_NOT_FOUND,
        );
      }

      if (diningSession.status === DiningSessionStatus.CLOSED) {
        throw new ReservationBusinessError(
          "Dining session is already closed",
          ReservationErrorCode.DINING_SESSION_ALREADY_CLOSED,
        );
      }

      const table = await tx.table.findUnique({
        where: { id: reservation.tableId },
        select: { id: true },
      });

      if (!table) {
        throw new ReservationBusinessError(
          "Table not found",
          ReservationErrorCode.TABLE_NOT_FOUND,
        );
      }

      await tx.diningSession.update({
        where: { id: diningSession.id },
        data: {
          status: DiningSessionStatus.CLOSED,
          endedAt: new Date(),
        },
      });

      await tx.table.update({
        where: { id: reservation.tableId },
        data: {
          status: TableStatus.AVAILABLE,
        },
      });

      return tx.reservation.update({
        where: { id },
        data: {
          status: ReservationStatus.COMPLETED,
        },
        include: {
          guest: true,
          table: true,
        },
      });
    });
  }

  async cancelReservation(
    id: string,
    restaurantId: string,
  ): Promise<ReservationWithGuest> {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findFirst({
        where: { id, restaurantId },
        select: { id: true, tableId: true, status: true },
      });

      if (!reservation) {
        throw new ReservationBusinessError(
          "Reservation not found",
          ReservationErrorCode.RESERVATION_NOT_FOUND,
        );
      }

      if (
        reservation.status !== ReservationStatus.PENDING &&
        reservation.status !== ReservationStatus.CONFIRMED
      ) {
        throw new ReservationBusinessError(
          `Cannot cancel a reservation with status ${reservation.status}. Only PENDING or CONFIRMED reservations can be cancelled.`,
          ReservationErrorCode.INVALID_STATE_TRANSITION,
        );
      }

      const updatedReservation = await tx.reservation.update({
        where: { id },
        data: {
          status: ReservationStatus.CANCELLED,
        },
        include: {
          guest: true,
          table: true,
        },
      });

      const table = await tx.table.findUnique({
        where: { id: reservation.tableId },
        select: { id: true },
      });

      if (table) {
        await tx.table.update({
          where: { id: reservation.tableId },
          data: { status: TableStatus.AVAILABLE },
        });
      }

      return updatedReservation;
    });
  }

  async markNoShow(
    id: string,
    restaurantId: string,
  ): Promise<ReservationWithGuest> {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findFirst({
        where: { id, restaurantId },
        select: { id: true, tableId: true, status: true },
      });

      if (!reservation) {
        throw new ReservationBusinessError(
          "Reservation not found",
          ReservationErrorCode.RESERVATION_NOT_FOUND,
        );
      }

      if (
        reservation.status !== ReservationStatus.PENDING &&
        reservation.status !== ReservationStatus.CONFIRMED
      ) {
        throw new ReservationBusinessError(
          `Cannot mark a reservation with status ${reservation.status} as no-show. Only PENDING or CONFIRMED reservations can be marked as no-show.`,
          ReservationErrorCode.INVALID_STATE_TRANSITION,
        );
      }

      const updatedReservation = await tx.reservation.update({
        where: { id },
        data: { status: ReservationStatus.NO_SHOW },
        include: { guest: true, table: true },
      });

      const table = await tx.table.findUnique({
        where: { id: reservation.tableId },
        select: { id: true },
      });

      if (table) {
        await tx.table.update({
          where: { id: reservation.tableId },
          data: { status: TableStatus.AVAILABLE },
        });
      }

      return updatedReservation;
    });
  }

  async updateReservation(
    id: string,
    restaurantId: string,
    input: UpdateReservationInput,
  ): Promise<ReservationWithGuest> {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findFirst({
        where: { id, restaurantId },
        include: { guest: true, table: true },
      });

      if (!reservation) {
        throw new ReservationBusinessError(
          "Reservation not found",
          ReservationErrorCode.RESERVATION_NOT_FOUND,
        );
      }

      if (
        reservation.status !== ReservationStatus.PENDING &&
        reservation.status !== ReservationStatus.CONFIRMED
      ) {
        throw new ReservationBusinessError(
          `Cannot update a reservation with status ${reservation.status}.`,
          ReservationErrorCode.INVALID_STATE_TRANSITION,
        );
      }

      let guestId = reservation.guestId;
      if (input.phone || input.name || input.email) {
        const phoneToUse = input.phone || reservation.guest.phone;
        const nameToUse = input.name || reservation.guest.name;
        const emailToUse = input.email !== undefined ? input.email : reservation.guest.email;

        const guest = await tx.guest.upsert({
          where: { phone: phoneToUse },
          update: {
            name: nameToUse,
            email: emailToUse,
          },
          create: {
            name: nameToUse,
            phone: phoneToUse,
            email: emailToUse,
          },
          select: { id: true },
        });
        guestId = guest.id;
      }

      const tableIdToUse = input.tableId || reservation.tableId;
      const reservationTimeToUse = input.reservationTime || reservation.reservationTime;
      const partySizeToUse = input.partySize || reservation.partySize;

      if (input.tableId || input.partySize) {
        const table = await tx.table.findUnique({
          where: { id: tableIdToUse },
          select: {
            id: true,
            capacity: true,
            isActive: true,
            floor: { select: { restaurantId: true } },
          },
        });

        if (!table || table.floor.restaurantId !== restaurantId) {
          throw new ReservationBusinessError(
            "Table not found or does not belong to restaurant",
            ReservationErrorCode.TABLE_NOT_FOUND,
          );
        }

        if (!table.isActive) {
          throw new ReservationBusinessError(
            "Table is not active",
            ReservationErrorCode.TABLE_NOT_FOUND,
          );
        }

        if (table.capacity < partySizeToUse) {
          throw new ReservationBusinessError(
            "Party size exceeds table capacity",
            ReservationErrorCode.TABLE_RESTAURANT_MISMATCH,
          );
        }
      }

      if (input.tableId || input.reservationTime) {
        const reservationStart = new Date(reservationTimeToUse);
        const windowStart = new Date(reservationStart.getTime() - 2 * 60 * 60 * 1000);
        const windowEnd = new Date(reservationStart.getTime() + 2 * 60 * 60 * 1000);

        const existingReservation = await tx.reservation.findFirst({
          where: {
            tableId: tableIdToUse,
            reservationTime: {
              gt: windowStart,
              lt: windowEnd,
            },
            status: { in: ACTIVE_RESERVATION_STATUSES },
            id: { not: id }, // Exclude the current reservation
          },
          select: { id: true },
        });

        if (existingReservation) {
          throw new ReservationBusinessError(
            "Table already reserved for this time",
            ReservationErrorCode.TABLE_ALREADY_RESERVED,
          );
        }
      }

      try {
        return await tx.reservation.update({
          where: { id },
          data: {
            tableId: tableIdToUse,
            guestId,
            reservationTime: reservationTimeToUse,
            partySize: partySizeToUse,
            occasion: input.occasion !== undefined ? input.occasion : reservation.occasion,
          },
          include: { guest: true, table: true },
        });
      } catch (error) {
        if (isUniqueConstraintViolation(error, "tableId")) {
          throw new ReservationBusinessError(
            "Table already reserved for this time",
            ReservationErrorCode.TABLE_ALREADY_RESERVED,
          );
        }
        throw error;
      }
    });
  }

  async deleteReservation(id: string, restaurantId: string): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findFirst({
        where: { id, restaurantId },
        select: { id: true, tableId: true },
      });

      if (!reservation) {
        throw new ReservationBusinessError(
          "Reservation not found",
          ReservationErrorCode.RESERVATION_NOT_FOUND,
        );
      }

      await tx.reservation.delete({
        where: { id },
      });

      const activeReservations = await tx.reservation.count({
        where: {
          tableId: reservation.tableId,
          status: { in: ACTIVE_RESERVATION_STATUSES },
        }
      });

      if (activeReservations === 0) {
        await tx.table.update({
          where: { id: reservation.tableId },
          data: { status: TableStatus.AVAILABLE },
        });
      }
    });
  }
}
