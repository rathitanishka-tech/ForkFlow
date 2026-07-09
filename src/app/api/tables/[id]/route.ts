import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { TableController } from "@/modules/table/table.controller";
import { TableService } from "@/modules/table/table.service";

// Instantiate dependencies
const tableService = new TableService(prisma);
const tableController = new TableController(tableService);

/**
 * Handles GET requests to retrieve a single table by its ID.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const table = await tableController.getById(id);

    if (!table) {
      return NextResponse.json({ message: "Table not found" }, { status: 404 });
    }

    return NextResponse.json(table, { status: 200 });
  } catch (error) {
    const id = await params.then((p) => p.id).catch(() => "unknown");
    console.error(`Error fetching table ${id}:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles PATCH requests to update an existing table.
 * Supports different actions based on the 'action' query parameter.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const body = await req.json();

    let updatedTable;

    switch (action) {
      case "position":
        updatedTable = await tableController.updatePosition(id, body);
        break;
      case "status":
        updatedTable = await tableController.updateStatus(id, body);
        break;
      default:
        updatedTable = await tableController.update(id, body);
        break;
    }

    return NextResponse.json(updatedTable, { status: 200 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
        { status: 400 },
      );
    }

    if (error.message === "Table not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error.message.includes("already exists")) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    const id = await params.then((p) => p.id).catch(() => "unknown");
    console.error(`Error updating table ${id}:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles DELETE requests to soft-delete a table.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // This performs a soft delete as implemented in the service.
    await tableController.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.message === "Table not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    const id = await params.then((p) => p.id).catch(() => "unknown");
    console.error(`Error deleting table ${id}:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
