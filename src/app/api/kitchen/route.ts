import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { KitchenController } from "@/modules/kitchen/kitchen.controller";
import { KitchenService } from "@/modules/kitchen/kitchen.service";
import { KitchenOrderStatus } from "@/modules/kitchen/kitchen.types";
import {
  getCurrentRestaurant,
  handleRestaurantApiError,
} from "@/lib/server-restaurant";

const kitchenService = new KitchenService(prisma);
const kitchenController = new KitchenController(kitchenService);

/**
 * Handles GET requests to retrieve the kitchen board.
 *
 * The restaurant is resolved server-side from the Clerk session.
 * The client must NOT supply a restaurantId query parameter.
 */
export async function GET(req: NextRequest) {
  try {
    const restaurant = await getCurrentRestaurant();

    const { searchParams } = new URL(req.url);

    const status =
      (searchParams.get("status") as KitchenOrderStatus) || undefined;

    const board = await kitchenController.getBoard({
      restaurantId: restaurant.id,
      status,
    });

    return NextResponse.json(board);
  } catch (error) {
    const authResponse = handleRestaurantApiError(error);
    if (authResponse) return authResponse;

    console.error("Error fetching kitchen board:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
