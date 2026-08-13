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

const isValidStatus = (status: unknown): status is KitchenOrderStatus => {
  return (
    typeof status === "string" &&
    ["PENDING", "PREPARING", "READY", "SERVED"].includes(status)
  );
};

/**
 * Handles PATCH requests to update an order's status.
 *
 * The restaurant is resolved server-side. The order must belong to the
 * authenticated user's restaurant.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const restaurant = await getCurrentRestaurant();
    const { id } = await params;
    const body = await req.json();

    if (!body.status || !isValidStatus(body.status)) {
      return NextResponse.json(
        {
          message:
            "Invalid status provided. Must be one of: PENDING, PREPARING, READY, SERVED.",
        },
        { status: 400 },
      );
    }

    const updatedOrder = await kitchenController.updateStatus(
      id,
      body.status,
      restaurant.id,
    );

    return NextResponse.json(updatedOrder);
  } catch (error: unknown) {
    const authResponse = handleRestaurantApiError(error);
    if (authResponse) return authResponse;

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof Error && error.message.includes("conflict")) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    console.error(`Error updating order status:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
