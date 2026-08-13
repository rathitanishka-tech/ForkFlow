import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { MenuController } from "@/modules/menu/menu.controller";
import { MenuService } from "@/modules/menu/menu.service";
import {
  getCurrentRestaurant,
  handleRestaurantApiError,
} from "@/lib/server-restaurant";

const menuService = new MenuService(prisma);
const menuController = new MenuController(menuService);

/**
 * Handles GET requests to retrieve a single menu item by its ID.
 *
 * The restaurant is resolved server-side. The menu item must belong to the
 * authenticated user's restaurant.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const restaurant = await getCurrentRestaurant();
    const { id } = await params;
    const menuItem = await menuController.getById(id, restaurant.id);

    if (!menuItem) {
      return NextResponse.json(
        { message: "Menu item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    const authResponse = handleRestaurantApiError(error);
    if (authResponse) return authResponse;

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
 *
 * The restaurant is resolved server-side. The menu item must belong to the
 * authenticated user's restaurant.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const restaurant = await getCurrentRestaurant();
    const { id } = await params;
    const body = (await req.json()) as Record<string, unknown>;
    const updatedMenuItem = await menuController.update(
      id,
      body,
      restaurant.id,
    );
    return NextResponse.json(updatedMenuItem);
  } catch (error: unknown) {
    const authResponse = handleRestaurantApiError(error);
    if (authResponse) return authResponse;

    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === "Menu item not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof Error && error.message.includes("already exists")) {
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
 *
 * The restaurant is resolved server-side. The menu item must belong to the
 * authenticated user's restaurant.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const restaurant = await getCurrentRestaurant();
    const { id } = await params;
    await menuController.delete(id, restaurant.id);
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const authResponse = handleRestaurantApiError(error);
    if (authResponse) return authResponse;

    if (error instanceof Error && error.message === "Menu item not found") {
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
 *
 * The restaurant is resolved server-side. The menu item must belong to the
 * authenticated user's restaurant.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const restaurant = await getCurrentRestaurant();
    const { id } = await params;
    const updatedMenuItem = await menuController.toggleAvailability(
      id,
      restaurant.id,
    );
    return NextResponse.json(updatedMenuItem);
  } catch (error: unknown) {
    const authResponse = handleRestaurantApiError(error);
    if (authResponse) return authResponse;

    if (error instanceof Error && error.message === "Menu item not found") {
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
