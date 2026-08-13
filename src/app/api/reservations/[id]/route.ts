import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ReservationService,
  ReservationBusinessError,
  ReservationErrorCode,
} from "@/modules/reservation/reservation.service";
import { ReservationController } from "@/modules/reservation/reservation.controller";
import {
  getCurrentRestaurant,
  handleRestaurantApiError,
} from "@/lib/server-restaurant";
import { revalidatePath } from "next/cache";

const reservationService = new ReservationService(prisma);
const reservationController = new ReservationController(reservationService);

function handleReservationError(error: unknown, prefix: string) {
  const authError = handleRestaurantApiError(error);
  if (authError) return authError;

  if (error instanceof ReservationBusinessError) {
    let status = 400;
    if (error.code === ReservationErrorCode.RESERVATION_NOT_FOUND || error.code === ReservationErrorCode.TABLE_NOT_FOUND) {
      status = 404;
    } else if (error.code === ReservationErrorCode.TABLE_ALREADY_RESERVED) {
      status = 409;
    }

    return NextResponse.json(
      { message: error.message, code: error.code },
      { status }
    );
  }

  console.error(`[${prefix}] Error:`, error);
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  return NextResponse.json({ message }, { status: 500 });
}

function triggerRevalidations() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/reservations");
  revalidatePath("/dashboard/floor-planner");
  revalidatePath("/dashboard/kitchen");
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const restaurant = await getCurrentRestaurant();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Reservation ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { action } = body;

    let reservation;

    switch (action) {
      case "confirm":
        reservation = await reservationController.confirm(id, restaurant.id);
        break;
      case "seat":
        reservation = await reservationController.seatGuest(id, restaurant.id);
        break;
      case "complete":
        reservation = await reservationController.completeDining(id, restaurant.id);
        break;
      case "cancel":
        reservation = await reservationController.cancel(id, restaurant.id);
        break;
      case "no-show":
        reservation = await reservationController.markNoShow(id, restaurant.id);
        break;
      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    triggerRevalidations();
    return NextResponse.json(reservation);
  } catch (error) {
    return handleReservationError(error, "PATCH /api/reservations/:id");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const restaurant = await getCurrentRestaurant();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Reservation ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const reservation = await reservationController.update(id, body, restaurant.id);

    triggerRevalidations();
    return NextResponse.json(reservation);
  } catch (error) {
    return handleReservationError(error, "PUT /api/reservations/:id");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const restaurant = await getCurrentRestaurant();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Reservation ID is required" }, { status: 400 });
    }

    await reservationController.delete(id, restaurant.id);

    triggerRevalidations();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleReservationError(error, "DELETE /api/reservations/:id");
  }
}
