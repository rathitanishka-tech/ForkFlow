import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { OrderController } from "@/modules/order/order.controller";
import { OrderService } from "@/modules/order/order.service";
import { OrderStatus } from "@/modules/order/order.types";
import { getCurrentRestaurant } from "@/lib/server-restaurant";

const orderService = new OrderService(prisma);
const orderController = new OrderController(orderService);

/**
 * Handles GET requests to retrieve a list of orders.
 *
 * The restaurant is resolved server-side from the Clerk session.
 * The client must NOT supply a restaurantId query parameter.
 */
export async function GET(req: NextRequest) {
  try {
    const restaurant = await getCurrentRestaurant();

    const { searchParams } = new URL(req.url);

    const tableId = searchParams.get("tableId") || undefined;
    const status = (searchParams.get("status") as OrderStatus) || undefined;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = await orderController.list({
      restaurantId: restaurant.id,
      tableId,
      status,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles POST requests to create a new order.
 *
 * The restaurantId is resolved server-side and injected into the input.
 * The client must NOT supply a restaurantId in the body.
 */
export async function POST(req: NextRequest) {
  try {
    const restaurant = await getCurrentRestaurant();

    const body = await req.json();

    const newOrder = await orderController.create(body, restaurant.id);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
        { status: 400 },
      );
    }

    if (
      error instanceof Error &&
      (error.message.includes("not found") ||
        error.message.includes("are invalid or not available"))
    ) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
