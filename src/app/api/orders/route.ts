import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { OrderController } from "@/modules/order/order.controller";
import { OrderService } from "@/modules/order/order.service";
import { OrderStatus } from "@/modules/order/order.types";

// Instantiate dependencies
const orderService = new OrderService(prisma);
const orderController = new OrderController(orderService);

/**
 * Handles GET requests to retrieve a list of orders.
 * Supports filtering and pagination via query parameters.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Safely parse query parameters
    const restaurantId = searchParams.get("restaurantId") || undefined;
    const tableId = searchParams.get("tableId") || undefined;
    const status = (searchParams.get("status") as OrderStatus) || undefined;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = await orderController.list({
      restaurantId,
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
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newOrder = await orderController.create(body);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
        { status: 400 },
      );
    }

    // Handle specific service-layer errors for 404
    if (
      error.message.includes("not found") ||
      error.message.includes("are invalid or not available")
    ) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    // Example for a potential conflict, though less common for order creation
    if (error.message.includes("already exists")) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    // Generic server error
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
