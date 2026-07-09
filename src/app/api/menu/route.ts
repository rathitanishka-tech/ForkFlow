import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { MenuController } from "@/modules/menu/menu.controller";
import { MenuService } from "@/modules/menu/menu.service";
import { SpiceLevel } from "@/modules/menu/menu.types";

// Instantiate dependencies
const menuService = new MenuService(prisma);
const menuController = new MenuController(menuService);

/**
 * Handles GET requests to retrieve a list of menu items.
 * Supports filtering and pagination via query parameters.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Safely parse query parameters
    const restaurantId = searchParams.get("restaurantId") || undefined;
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
      restaurantId,
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
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles POST requests to create a new menu item.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newMenuItem = await menuController.create(body);
    return NextResponse.json(newMenuItem, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
        { status: 400 },
      );
    }

    if (
      error.message === "Restaurant not found." ||
      error.message === "Category or Restaurant not found."
    ) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error.message.includes("already exists")) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
