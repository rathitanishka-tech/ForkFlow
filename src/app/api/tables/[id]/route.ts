import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  getCurrentRestaurant,
  handleRestaurantApiError,
} from "@/lib/server-restaurant";
import { prisma } from "@/lib/prisma";
import { TableController } from "@/modules/table/table.controller";
import { TableService } from "@/modules/table/table.service";

const tableService = new TableService(prisma);
const tableController = new TableController(tableService);

/**
 * Handles GET requests to retrieve a single table by its ID.
 *
 * The restaurant is resolved server-side to ensure the table belongs to it.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const restaurant = await getCurrentRestaurant();
    const { id } = await params;

    const table = await tableController.getById(id, restaurant.id);

    if (!table) {
      return NextResponse.json({ message: "Table not found" }, { status: 404 });
    }

    return NextResponse.json(table);
  } catch (error) {
    const authResponse = handleRestaurantApiError(error);
    if (authResponse) return authResponse;

    console.error(error);

    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles PUT requests to update a table.
 *
 * The restaurantId is resolved server-side and used to verify floor ownership.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const restaurant = await getCurrentRestaurant();
    const body = await req.json();
    const { id } = await params;

    const updatedTable = await tableController.update(id, body, restaurant.id);

    return NextResponse.json(updatedTable);
  } catch (error: unknown) {
    const authResponse = handleRestaurantApiError(error);
    if (authResponse) return authResponse;

    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
        { status: 400 },
      );
    }

    if (
      error instanceof Error &&
      (error.message === "Table not found" ||
        error.message === "Floor not found")
    ) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    console.error(error);

    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles DELETE requests to delete a table.
 *
 * The restaurantId is resolved server-side to ensure ownership.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const restaurant = await getCurrentRestaurant();
    const { id } = await params;

    await tableController.delete(id, restaurant.id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const authResponse = handleRestaurantApiError(error);
    if (authResponse) return authResponse;

    console.error(error);

    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
