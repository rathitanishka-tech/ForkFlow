import { prisma as db } from "@/lib/prisma";
import { Table, TableStatus } from "@prisma/client";
import type {
  RecommendedTable,
  TableRecommendationRequest,
} from "./tableRecommendation.types";

class TableRecommendationService {
  private readonly RECOMMENDATION_COUNT = 3;

  /**
   * Generates table recommendations based on a rule-based scoring system.
   * @param criteria The user's preferences for a table.
   * @returns A promise that resolves to the top recommended tables.
   */
  public async getTableRecommendations(
    criteria: TableRecommendationRequest,
  ): Promise<RecommendedTable[]> {
    // For now, we only recommend from the first floor of the first restaurant.
    // This can be expanded to take restaurant/floor IDs as input.
    const floor = await db.floor.findFirst({
      include: { tables: true },
    });

    if (!floor) {
      return [];
    }

    // 1. Filter tables by basic availability and capacity
    const eligibleTables = floor.tables.filter(
      (table) =>
        table.status === TableStatus.AVAILABLE &&
        table.capacity >= criteria.guests,
    );

    // In a real-world scenario, you would also check for reservation conflicts
    // around the `criteria.reservationDate`. For this example, we assume
    // `TableStatus.AVAILABLE` is sufficient for an immediate seating request.

    // 2. Score each eligible table based on the criteria
    const scoredTables = eligibleTables.map((table) =>
      this.scoreTable(table, criteria, floor),
    );

    // 3. Sort by score in descending order and take the top results
    const topRecommendations = scoredTables
      .sort((a, b) => b.score - a.score)
      .slice(0, this.RECOMMENDATION_COUNT);

    return topRecommendations;
  }

  /**
   * Scores a single table against the provided recommendation criteria.
   * @param table The table to score.
   * @param criteria The user's preferences.
   * @param floor The floor layout for context (e.g., dimensions).
   * @returns A RecommendedTable object with score and reasoning.
   */
  private scoreTable(
    table: Table,
    criteria: TableRecommendationRequest,
    floor: { width: number; height: number },
  ): RecommendedTable {
    let score = 100;
    const reasoning: string[] = ["Base score for availability and capacity."];

    // a. Capacity Fit Score: Penalize for too much extra space
    const capacityDiff = table.capacity - criteria.guests;
    if (capacityDiff > 2) {
      score -= capacityDiff * 5; // -5 points for each extra seat over 2
      reasoning.push(`- ${capacityDiff * 5} pts: Larger than needed`);
    } else {
      score += 10;
      reasoning.push(`+ 10 pts: Good capacity fit`);
    }

    // b. Shape Preference Score
    if (criteria.preferredShape && table.shape === criteria.preferredShape) {
      score += 20;
      reasoning.push(`+ 20 pts: Matches preferred shape (${table.shape})`);
    }

    // c. Window Preference Score (heuristic based on position)
    // Assumes tables near the edges (x < 20 or y < 20) are near windows.
    const isNearWindow = table.xPosition < 20 || table.yPosition < 20;
    if (criteria.windowPreferred && isNearWindow) {
      score += 25;
      reasoning.push("+ 25 pts: Near a window");
    }

    // d. Quiet Area Score (heuristic based on position)
    // Assumes tables in corners are quieter.
    const isQuiet =
      (table.xPosition > floor.width * 0.75 &&
        table.yPosition > floor.height * 0.75) ||
      (table.xPosition < floor.width * 0.25 &&
        table.yPosition < floor.height * 0.25);
    if (criteria.quietArea && isQuiet) {
      score += 25;
      reasoning.push("+ 25 pts: Located in a quiet area");
    }

    // e. Occasion-based Score
    switch (criteria.occasion) {
      case "DATE_NIGHT":
        if (table.capacity === 2 && isQuiet) {
          score += 30;
          reasoning.push("+ 30 pts: Ideal for a date night (intimate, quiet)");
        }
        break;
      case "BUSINESS_MEETING":
        if (table.shape === "SQUARE" || table.shape === "RECTANGLE") {
          score += 20;
          reasoning.push("+ 20 pts: Good for business meetings (square/rect)");
        }
        break;
      case "BIRTHDAY":
        if (table.capacity >= 6 && table.shape === "ROUND") {
          score += 20;
          reasoning.push("+ 20 pts: Great for groups/birthdays (large, round)");
        }
        break;
    }

    return {
      table: {
        id: table.id,
        number: table.number,
        capacity: table.capacity,
        shape: table.shape,
        xPosition: table.xPosition,
        yPosition: table.yPosition,
      },
      score: Math.max(0, score), // Ensure score doesn't go below 0
      reasoning,
    };
  }
}

export const tableRecommendationService = new TableRecommendationService();
