import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { TableController } from "@/modules/table/table.controller";
import { TableService } from "@/modules/table/table.service";
import { TableShape, TableStatus } from "@/modules/table/table.types";

// Instantiate dependencies
const tableService = new TableService(prisma);
const tableController = new TableController(tableService);

/**
 * Handles GET requests to retrieve a list of tables.
 * Supports filtering and pagination via query parameters.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Safely parse query parameters
    const floorId = searchParams.get("floorId") || undefined;
    const status = (searchParams.get("status") as TableStatus) || undefined;
    const shape = (searchParams.get("shape") as TableShape) || undefined;
    const search = searchParams.get("search") || undefined;

    const isActiveParam = searchParams.get("isActive");
    const isActive =
      isActiveParam === null ? undefined : isActiveParam === "true";

    const minCapacity = searchParams.has("minCapacity")
      ? parseInt(searchParams.get("minCapacity")!, 10)
      : undefined;
    const maxCapacity = searchParams.has("maxCapacity")
      ? parseInt(searchParams.get("maxCapacity")!, 10)
      : undefined;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = await tableController.list({
      floorId,
      status,
      shape,
      isActive,
      search,
      minCapacity,
      maxCapacity,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles POST requests to create a new table or multiple tables in bulk.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Differentiate between a single table creation and a bulk creation
    if (Array.isArray(body.tables)) {
      const result = await tableController.bulkCreate(body);
      return NextResponse.json(result, { status: 201 });
    }

    const newTable = await tableController.create(body);
    return NextResponse.json(newTable, { status: 201 });
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

    if (
      error.message.includes("already exists") ||
      error.message.includes("Bulk creation failed")
    ) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    console.error("Error creating table(s):", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
