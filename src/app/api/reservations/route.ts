import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReservationController } from "@/modules/reservation/reservation.controller";
import {
  ReservationService,
  ReservationBusinessError,
  ReservationErrorCode,
} from "@/modules/reservation/reservation.service";
import {
  getCurrentRestaurant,
  handleRestaurantApiError,
} from "@/lib/server-restaurant";

const reservationService = new ReservationService(prisma);
const reservationController = new ReservationController(reservationService);

/**
 * GET /api/reservations
 *
 * Returns all reservations for the authenticated user's restaurant.
 * The restaurant is resolved server-side from the Clerk session.
 */
export async function GET() {
  try {
    const restaurant = await getCurrentRestaurant();

    const reservations = await reservationController.getReservations(
      restaurant.id,
    );

    return NextResponse.json({
      data: reservations,
    });
  } catch (error) {
    const authError = handleRestaurantApiError(error);
    if (authError) return authError;

    if (error instanceof ReservationBusinessError) {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: 400 } // Or 404/409 based on code, but 400 is a safe fallback for general business rules in GET (though unlikely)
      );
    }

    console.error("[GET /api/reservations] Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch reservations";

    return NextResponse.json({ message }, { status: 500 });
  }
}

/**
 * POST /api/reservations
 *
 * Creates a new reservation for the authenticated user's restaurant.
 * The restaurantId is resolved server-side and injected into the input.
 * The client must NOT supply a restaurantId in the body.
 */
export async function POST(request: Request) {
  try {
    const restaurant = await getCurrentRestaurant();

    const body = await request.json();

    const reservation = await reservationController.create(body, restaurant.id);

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    const authError = handleRestaurantApiError(error);
    if (authError) return authError;

    if (error instanceof ReservationBusinessError) {
      let status = 400;
      if (
        error.code === ReservationErrorCode.TABLE_NOT_FOUND ||
        error.code === ReservationErrorCode.RESTAURANT_NOT_FOUND
      ) {
        status = 404;
      } else if (
        error.code === ReservationErrorCode.TABLE_ALREADY_RESERVED
      ) {
        status = 409;
      }

      return NextResponse.json(
        { message: error.message, code: error.code },
        { status }
      );
    }

    console.error("[POST /api/reservations] Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create reservation";

    return NextResponse.json({ message }, { status: 500 }); // Keep unexpected server errors at 500
  }
}
