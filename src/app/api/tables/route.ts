import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  getCurrentRestaurant,
  handleRestaurantApiError,
} from "@/lib/server-restaurant";
import { prisma } from "@/lib/prisma";
import { TableController } from "@/modules/table/table.controller";
import { TableService } from "@/modules/table/table.service";

const tableService = new TableService(prisma);
const tableController = new TableController(tableService);

export async function GET(req: NextRequest) {
  try {
    const restaurant = await getCurrentRestaurant();

    const { searchParams } = new URL(req.url);

    const filters = {
      restaurantId: restaurant.id,
      floorId: searchParams.get("floorId") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      page: Number(searchParams.get("page") ?? "1"),
      limit: Number(searchParams.get("limit") ?? "20"),
    };

    const result = await tableController.list(filters);

    return NextResponse.json(result);
  } catch (error) {
    const authResponse = handleRestaurantApiError(error);
    if (authResponse) return authResponse;

    console.error(error);

    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const restaurant = await getCurrentRestaurant();

    const body = await req.json();

    const table = await tableController.create(body, restaurant.id);

    return NextResponse.json(table, { status: 201 });
  } catch (error: unknown) {
    const authResponse = handleRestaurantApiError(error);
    if (authResponse) return authResponse;

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.issues,
        },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    console.error(error);

    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
