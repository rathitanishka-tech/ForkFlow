import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { MenuController } from "@/modules/menu/menu.controller";
import { MenuService } from "@/modules/menu/menu.service";
import { SpiceLevel } from "@/modules/menu/menu.types";
import {
  getCurrentRestaurant,
  handleRestaurantApiError,
} from "@/lib/server-restaurant";

const menuService = new MenuService(prisma);
const menuController = new MenuController(menuService);

/**
 * Handles GET requests to retrieve a list of menu items.
 *
 * The restaurant is resolved server-side from the Clerk session.
 * The client must NOT supply a restaurantId query parameter.
 */
export async function GET(req: NextRequest) {
  try {
    const restaurant = await getCurrentRestaurant();

    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category") || undefined;
    const spiceLevel =
      (searchParams.get("spiceLevel") as SpiceLevel) || undefined;
    const search = searchParams.get("search") || undefined;

    const isAvailableParam = searchParams.get("isAvailable");
    const isAvailable =
      isAvailableParam === null ? undefined : isAvailableParam === "true";

    const isVegParam = searchParams.get("isVeg");
    const isVeg = isVegParam === null ? undefined : isVegParam === "true";

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = await menuController.list({
      restaurantId: restaurant.id,
      category,
      isAvailable,
      isVeg,
      spiceLevel,
      search,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    const authResponse = handleRestaurantApiError(error);
    if (authResponse) return authResponse;

    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles POST requests to create a new menu item.
 *
 * The restaurantId is resolved server-side and injected into the input.
 * The client must NOT supply a restaurantId in the body.
 */
export async function POST(req: NextRequest) {
  try {
    const restaurant = await getCurrentRestaurant();

    const body = await req.json();

    const newMenuItem = await menuController.create(body, restaurant.id);
    return NextResponse.json(newMenuItem, { status: 201 });
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
      (error.message === "Restaurant not found." ||
        error.message === "Category or Restaurant not found.")
    ) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
