import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { KitchenController } from "@/modules/kitchen/kitchen.controller";
import { KitchenService } from "@/modules/kitchen/kitchen.service";
import { KitchenOrderStatus } from "@/modules/kitchen/kitchen.types";

// Instantiate dependencies
const kitchenService = new KitchenService(prisma);
const kitchenController = new KitchenController(kitchenService);

/**
 * Handles GET requests to retrieve the kitchen board.
 * Requires a `restaurantId` query parameter.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const restaurantId = searchParams.get("restaurantId");
    if (!restaurantId) {
      return NextResponse.json(
        { message: "restaurantId is a required query parameter." },
        { status: 400 },
      );
    }

    const status =
      (searchParams.get("status") as KitchenOrderStatus) || undefined;

    const board = await kitchenController.getBoard({ restaurantId, status });

    return NextResponse.json(board);
  } catch (error) {
    console.error("Error fetching kitchen board:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
