import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { OrderController } from "@/modules/order/order.controller";
import { OrderService } from "@/modules/order/order.service";

// Instantiate dependencies
const orderService = new OrderService(prisma);
const orderController = new OrderController(orderService);

/**
 * Handles GET requests to retrieve a single order by its ID.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const order = await orderController.getById(id);

    if (!order) {
      return NextResponse.json(
        { message: `Order with ID ${id} not found.` },
        { status: 404 },
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(`Error fetching order:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

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
    const updatedOrder = await orderController.update(id, body);

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
        { status: 400 },
      );
    }

    if (error.message.includes("not found")) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    // Example for a potential conflict
    if (error.message.includes("conflict")) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    console.error(`Error updating order:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles DELETE requests to permanently delete an order.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await orderController.delete(id);

    // Return a 204 No Content response for successful deletion
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    // Prisma's delete throws an error if the record is not found
    if (error.code === "P2025") {
      const { id } = await params;
      return NextResponse.json(
        { message: `Order with ID ${id} not found.` },
        { status: 404 },
      );
    }

    console.error(`Error deleting order:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
