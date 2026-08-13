import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { OrderController } from "@/modules/order/order.controller";
import { OrderService } from "@/modules/order/order.service";
import { getCurrentRestaurant } from "@/lib/server-restaurant";

const orderService = new OrderService(prisma);
const orderController = new OrderController(orderService);

/**
 * Handles GET requests to retrieve a single order by its ID.
 *
 * The restaurant is resolved server-side. The order must belong to the
 * authenticated user's restaurant.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const restaurant = await getCurrentRestaurant();
    const { id } = await params;
    const order = await orderController.getById(id, restaurant.id);

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
    const updatedOrder = await orderController.update(id, body, restaurant.id);

    return NextResponse.json(updatedOrder);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof Error && error.message.includes("conflict")) {
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
 *
 * The restaurant is resolved server-side. The order must belong to the
 * authenticated user's restaurant.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const restaurant = await getCurrentRestaurant();
    const { id } = await params;
    await orderController.delete(id, restaurant.id);

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("not found")) {
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
