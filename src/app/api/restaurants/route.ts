import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { prisma } from "@/lib/prisma";
import {
  PropertyType,
  RestaurantController,
  RestaurantService,
} from "@/modules/restaurant";

const restaurantService = new RestaurantService(prisma);
const restaurantController = new RestaurantController(restaurantService);

function parseIsActive(value: string | null): boolean | undefined {
  if (value === null) {
    return undefined;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error("Invalid isActive filter");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurants = await restaurantController.list({
      businessId: searchParams.get("businessId") ?? undefined,
      isActive: parseIsActive(searchParams.get("isActive")),
      propertyType:
        (searchParams.get("propertyType") as PropertyType | null) ?? undefined,
      search: searchParams.get("search") ?? undefined,
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    if (
      error instanceof Error &&
      error.message === "Invalid isActive filter"
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const restaurant = await restaurantController.create(body);

    return NextResponse.json(restaurant, { status: 201 });
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
      if (error.message === "Business not found") {
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
