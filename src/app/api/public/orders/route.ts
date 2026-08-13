import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { prisma } from "@/lib/prisma";
import { OrderController } from "@/modules/order/order.controller";
import { OrderService } from "@/modules/order/order.service";

const orderService = new OrderService(prisma);
const orderController = new OrderController(orderService);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.restaurantId) {
      return NextResponse.json(
        { message: "restaurantId is required" },
        { status: 400 },
      );
    }

    const order = await orderController.create(body, body.restaurantId);

    return NextResponse.json(order, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.issues,
        },
        { status: 400 },
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        message: "An unexpected error occurred.",
      },
      { status: 500 },
    );
  }
}
