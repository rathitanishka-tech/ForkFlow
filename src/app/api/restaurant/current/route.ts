import { NextResponse } from "next/server";
import { getCurrentRestaurant } from "@/lib/server-restaurant";
import {
  AuthenticationError,
  RestaurantNotFoundError,
} from "@/lib/server-restaurant";

/**
 * GET /api/restaurant/current
 *
 * Returns the authenticated user's restaurant, resolved entirely on the
 * server via the Clerk session. No client-supplied restaurantId is trusted.
 *
 * This endpoint is the single source of truth for the client to learn
 * "which restaurant am I working with right now?"
 */
export async function GET() {
  try {
    const restaurant = await getCurrentRestaurant();
    return NextResponse.json(restaurant);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (error instanceof RestaurantNotFoundError) {
      return NextResponse.json(
        { message: "No restaurant configured for this user" },
        { status: 404 },
      );
    }

    console.error("Error resolving current restaurant:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
