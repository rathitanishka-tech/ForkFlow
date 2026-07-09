import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { KitchenController } from "@/modules/kitchen/kitchen.controller";
import { KitchenService } from "@/modules/kitchen/kitchen.service";
import { KitchenOrderStatus } from "@/modules/kitchen/kitchen.types";

// Instantiate dependencies
const kitchenService = new KitchenService(prisma);
const kitchenController = new KitchenController(kitchenService);

const isValidStatus = (status: any): status is KitchenOrderStatus => {
  return ["PENDING", "PREPARING", "READY", "SERVED"].includes(status);
};

/**
 * Handles PATCH requests to update an order's status.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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

    const updatedOrder = await kitchenController.updateStatus(id, body.status);

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    if (error.message.includes("not found")) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    // Example for a potential conflict
    if (error.message.includes("conflict")) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    console.error(`Error updating order status:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
