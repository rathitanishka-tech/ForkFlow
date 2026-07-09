import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { FloorController } from "@/modules/floor/floor.controller";
import { FloorService } from "@/modules/floor/floor.service";

// Instantiate dependencies
const floorService = new FloorService(prisma);
const floorController = new FloorController(floorService);

/**
 * Handles GET requests to retrieve a list of floors.
 * Supports filtering by restaurantId, active status, and search term, with pagination.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Safely parse query parameters
    const restaurantId = searchParams.get("restaurantId") || undefined;
    const search = searchParams.get("search") || undefined;
    const isActiveParam = searchParams.get("isActive");
    const isActive =
      isActiveParam === null ? undefined : isActiveParam === "true";

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = await floorController.list({
      restaurantId,
      search,
      isActive,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching floors:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles POST requests to create a new floor.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newFloor = await floorController.create(body);
    return NextResponse.json(newFloor, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
        { status: 400 },
      );
    }

    if (error.message === "Restaurant not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (
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
