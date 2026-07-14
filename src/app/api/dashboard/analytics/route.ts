import { analyticsController } from "@/modules/analytics/analytics.controller";
import { NextResponse } from "next/server";

/**
 * GET handler for the /api/dashboard/analytics endpoint.
 * Fetches and returns a summary of restaurant analytics.
 */
export async function GET() {
  try {
    const analyticsData = await analyticsController.getDashboardAnalytics();
    return NextResponse.json(analyticsData);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Internal Server Error", error: errorMessage },
      { status: 500 },
    );
  }
}
