import type { Table, TableShape } from "@prisma/client";

/**
 * Defines the input structure for a table recommendation request.
 */
export interface TableRecommendationRequest {
  guests: number;
  occasion?: "BIRTHDAY" | "DATE_NIGHT" | "BUSINESS_MEETING" | "CASUAL";
  preferredShape?: TableShape;
  windowPreferred?: boolean;
  quietArea?: boolean;
  reservationDate: string; // ISO 8601 string
}

/**
 * Represents a single recommended table with its score and the reasoning behind it.
 */
export interface RecommendedTable {
  table: Pick<
    Table,
    "id" | "number" | "capacity" | "shape" | "xPosition" | "yPosition"
  >;
  score: number;
  reasoning: string[];
}

/**
 * Represents the final API response containing the top recommended tables.
 */
export interface TableRecommendationResponse {
  recommendations: RecommendedTable[];
}
