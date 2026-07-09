import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { MenuController } from "@/modules/menu/menu.controller";
import { MenuService } from "@/modules/menu/menu.service";

// Instantiate dependencies
const menuService = new MenuService(prisma);
const menuController = new MenuController(menuService);

/**
 * Handles GET requests to retrieve a single menu item by its ID.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const menuItem = await menuController.getById(id);

    if (!menuItem) {
      return NextResponse.json(
        { message: "Menu item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    const id = await params.then((p) => p.id).catch(() => "unknown");
    console.error(`Error fetching menu item ${id}:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles PATCH requests to update an existing menu item.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updatedMenuItem = await menuController.update(id, body);
    return NextResponse.json(updatedMenuItem);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
        { status: 400 },
      );
    }

    if (error.message === "Menu item not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error.message.includes("already exists")) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    const id = await params.then((p) => p.id).catch(() => "unknown");
    console.error(`Error updating menu item ${id}:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles DELETE requests to soft-delete a menu item.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // This performs a soft delete as implemented in the service.
    await menuController.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.message === "Menu item not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    const id = await params.then((p) => p.id).catch(() => "unknown");
    console.error(`Error deleting menu item ${id}:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles POST requests to toggle the availability of a menu item.
 * This is a special-purpose endpoint.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const updatedMenuItem = await menuController.toggleAvailability(id);
    return NextResponse.json(updatedMenuItem);
  } catch (error: any) {
    if (error.message === "Menu item not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    const id = await params.then((p) => p.id).catch(() => "unknown");
    console.error(`Error toggling availability for menu item ${id}:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Note: The prompt requested a POST to `/api/menu/:id/toggle`.
 * To achieve that specific route, a file at `src/app/api/menu/[id]/toggle/route.ts`
 * would be needed. The POST handler above is placed in `src/app/api/menu/[id]/route.ts`
 * to satisfy the "Create ONLY" constraint, making the toggle endpoint `POST /api/menu/[id]`.
 */
