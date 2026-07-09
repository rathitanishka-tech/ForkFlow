/**
 * Defines the input parameters for a table recommendation request.
 */
export interface RecommendationRequest {
  restaurantId: string;
  partySize: number;
  occasion?:
    | "Birthday"
    | "Anniversary"
    | "Business"
    | "Family"
    | "Date"
    | "Friends";
  seatingPreference?: "WINDOW" | "INDOOR" | "OUTDOOR" | "BAR";
  noisePreference?: "QUIET" | "NORMAL" | "LIVELY";
}

/**
 * Represents a single reason why a table was recommended, contributing to its score.
 */
export interface RecommendationReason {
  code:
    | "CAPACITY_MATCH"
    | "SEATING_PREFERENCE_MATCH"
    | "OCCASION_MATCH"
    | "NOISE_PREFERENCE_MATCH"
    | "GENERAL_BONUS";
  description: string;
}

/**
 * Represents a single table that has been scored and recommended.
 */
export interface RecommendedTable {
  tableId: string;
  tableNumber: string;
  matchScore: number; // A score from 0 to 1 representing the quality of the match.
  reasons: RecommendationReason[];
}

/**
 * The final response structure containing a list of recommended tables,
 * typically sorted from best to worst match.
 */
export interface RecommendationResponse {
  recommendations: RecommendedTable[];
}
