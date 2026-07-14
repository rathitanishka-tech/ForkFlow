import { tableRecommendationController } from "@/modules/tableRecommendation/tableRecommendation.controller";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler for the /api/table-recommendation endpoint.
 *
 * @param request The incoming Next.js request object.
 * @returns A JSON response with recommended tables or an error.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await tableRecommendationController.getRecommendations(body);
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    const status =
      error instanceof Error &&
      (error.message.includes("required") || error instanceof SyntaxError)
        ? 400
        : 500;
    return NextResponse.json({ message: errorMessage }, { status });
  }
}
