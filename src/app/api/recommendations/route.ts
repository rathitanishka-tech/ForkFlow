import { recommendationController } from "@/modules/recommendation/recommendation.controller";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler for the /api/recommendations endpoint.
 *
 * @param request The incoming Next.js request object.
 * @returns A JSON response with recommended menu items or an error.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const menuItemId = searchParams.get("menuItemId");

  try {
    const recommendations =
      await recommendationController.getRecommendations(menuItemId);
    return NextResponse.json(recommendations);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    // Use 400 for client errors (e.g., missing param) and 500 for server errors.
    const status =
      error instanceof Error && error.message.includes("required") ? 400 : 500;
    return NextResponse.json({ message: errorMessage }, { status });
  }
}
