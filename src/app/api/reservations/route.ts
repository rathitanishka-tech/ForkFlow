import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { prisma } from "@/lib/prisma";
import { ReservationController } from "@/modules/reservation/reservation.controller";
import { ReservationService } from "@/modules/reservation/reservation.service";

const reservationService = new ReservationService(prisma);
const reservationController = new ReservationController(reservationService);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reservation = await reservationController.create(body);

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      if (error.message === "Table already reserved") {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }

      if (
        error.message === "Restaurant not found" ||
        error.message === "Table not found"
      ) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      if (error.message === "Table does not belong to restaurant") {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
