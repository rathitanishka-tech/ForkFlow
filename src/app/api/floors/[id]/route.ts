import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { FloorController } from "@/modules/floor/floor.controller";
import { FloorService } from "@/modules/floor/floor.service";

// Instantiate dependencies
const floorService = new FloorService(prisma);
const floorController = new FloorController(floorService);

/**
 * Handles GET requests to retrieve a single floor by its ID.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const floor = await floorController.getById(id);

    if (!floor) {
      return NextResponse.json({ message: "Floor not found" }, { status: 404 });
    }

    return NextResponse.json(floor, { status: 200 });
  } catch (error) {
    const id = await params.then((p) => p.id).catch(() => "unknown");
    console.error(`Error fetching floor ${id}:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles PATCH requests to update an existing floor.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const updatedFloor = await floorController.update(id, body);

    return NextResponse.json(updatedFloor, { status: 200 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
        { status: 400 },
      );
    }

    if (error.message === "Floor not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error.message.includes("already exists")) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    const id = await params.then((p) => p.id).catch(() => "unknown");
    console.error(`Error updating floor ${id}:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles DELETE requests to soft-delete a floor.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // This performs a soft delete as implemented in the service.
    await floorController.delete(id);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.message === "Floor not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    const id = await params.then((p) => p.id).catch(() => "unknown");
    console.error(`Error deleting floor ${id}:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
