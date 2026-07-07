import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { prisma } from "@/lib/prisma";
import { RestaurantController, RestaurantService } from "@/modules/restaurant";

const restaurantService = new RestaurantService(prisma);
const restaurantController = new RestaurantController(restaurantService);

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const restaurant = await restaurantController.getById(id);

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(restaurant);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const restaurant = await restaurantController.update(id, body);

    return NextResponse.json(restaurant);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      if (
        error.message === "Restaurant not found" ||
        error.message === "Business not found"
      ) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      if (error.message === "Restaurant slug already exists") {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const restaurant = await restaurantController.delete(id);

    return NextResponse.json(restaurant);
  } catch (error) {
    if (error instanceof Error && error.message === "Restaurant not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
