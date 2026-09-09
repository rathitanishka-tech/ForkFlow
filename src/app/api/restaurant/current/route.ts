import { NextResponse } from "next/server";
import { getCurrentRestaurant } from "@/lib/server-restaurant";
import {
  AuthenticationError,
  RestaurantNotFoundError,
} from "@/lib/server-restaurant";
import { prisma } from "@/lib/prisma";

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

export async function DELETE() {
  try {
    const restaurant = await getCurrentRestaurant();
    
    await prisma.$transaction(async (tx) => {
      // Manually delete dependent records to avoid strict FK constraint errors
      // (e.g. DiningSession -> Reservation which lacks cascade)
      await tx.orderItem.deleteMany({ where: { order: { restaurantId: restaurant.id } } });
      await tx.order.deleteMany({ where: { restaurantId: restaurant.id } });
      await tx.diningSession.deleteMany({ where: { restaurantId: restaurant.id } });
      await tx.reservation.deleteMany({ where: { restaurantId: restaurant.id } });
      await tx.menuItem.deleteMany({ where: { restaurantId: restaurant.id } });
      
      const floors = await tx.floor.findMany({ where: { restaurantId: restaurant.id } });
      const floorIds = floors.map(f => f.id);
      
      await tx.table.deleteMany({ where: { floorId: { in: floorIds } } });
      await tx.floor.deleteMany({ where: { restaurantId: restaurant.id } });
      
      await tx.restaurant.delete({ where: { id: restaurant.id } });
      await tx.businessMembership.deleteMany({ where: { businessId: restaurant.businessId } });
      await tx.business.delete({ where: { id: restaurant.businessId } });
    }, { timeout: 20000 });

    return NextResponse.json({ success: true });
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

    console.error("Error deleting restaurant:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
