import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { FloorController } from "@/modules/floor/floor.controller";
import { FloorService } from "@/modules/floor/floor.service";
import {
  getCurrentRestaurant,
  handleRestaurantApiError,
} from "@/lib/server-restaurant";

const floorService = new FloorService(prisma);
const floorController = new FloorController(floorService);

/**
 * Handles GET requests to retrieve a list of floors.
 *
 * The restaurant is resolved server-side from the Clerk session.
 * The client must NOT supply a restaurantId query parameter.
 */
export async function GET(req: NextRequest) {
  try {
    const restaurant = await getCurrentRestaurant();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || undefined;
    const isActiveParam = searchParams.get("isActive");
    const isActive =
      isActiveParam === null ? undefined : isActiveParam === "true";

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = await floorController.list({
      restaurantId: restaurant.id,
      search,
      isActive,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    const authResponse = handleRestaurantApiError(error);
    if (authResponse) return authResponse;

    console.error("Error fetching floors:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles POST requests to create a new floor.
 *
 * The restaurantId is resolved server-side and injected into the input.
 * The client must NOT supply a restaurantId in the body.
 */
export async function POST(req: NextRequest) {
  try {
    const restaurant = await getCurrentRestaurant();

    const body = await req.json();

    const newFloor = await floorController.create(body, restaurant.id);
    return NextResponse.json(newFloor, { status: 201 });
  } catch (error: unknown) {
    const authResponse = handleRestaurantApiError(error);
    if (authResponse) return authResponse;

    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === "Restaurant not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (
      error instanceof Error &&
      error.message.includes(
        "A floor with this level already exists for this restaurant.",
      )
    ) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    console.error("Error creating floor:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
