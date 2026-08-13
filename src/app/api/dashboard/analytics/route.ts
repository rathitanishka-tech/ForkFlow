import { analyticsController } from "@/modules/analytics/analytics.controller";
import { getCurrentRestaurant } from "@/lib/server-restaurant";
import { NextResponse } from "next/server";

/**
 * GET handler for the /api/dashboard/analytics endpoint.
 *
 * The restaurant is resolved server-side from the Clerk session.
 * The client must NOT supply a restaurantId query parameter.
 */
export async function GET() {
  try {
    const restaurant = await getCurrentRestaurant();

    const analyticsData = await analyticsController.getDashboardAnalytics(
      restaurant.id,
    );

    return NextResponse.json(analyticsData);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    const status =
      error instanceof Error && error.message.includes("not found") ? 404 : 500;

    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: errorMessage,
      },
      {
        status,
      },
    );
  }
}
