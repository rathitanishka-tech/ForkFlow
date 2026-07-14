import type { TableRecommendationRequest } from "./tableRecommendation.types";

export class TableRecommendationValidator {
  /**
   * Validates the table recommendation request payload.
   * @param body The request body.
   * @throws {Error} if validation fails.
   */
  public validateRequest(body: Partial<TableRecommendationRequest>): void {
    if (!body.guests || typeof body.guests !== "number" || body.guests <= 0) {
      throw new Error("A valid 'guests' count (number) is required.");
    }

    if (!body.reservationDate || isNaN(Date.parse(body.reservationDate))) {
      throw new Error(
        "A valid 'reservationDate' (ISO 8601 string) is required.",
      );
    }
    // Additional checks for occasion, shape, etc., can be added here.
  }
}
