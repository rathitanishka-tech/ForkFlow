import { tableRecommendationService } from "./tableRecommendation.service";
import { TableRecommendationValidator } from "./tableRecommendation.validator";
import type { TableRecommendationRequest } from "./tableRecommendation.types";

class TableRecommendationController {
  private validator = new TableRecommendationValidator();

  /**
   * Handles the request to get table recommendations.
   * @param body The request payload containing user preferences.
   * @returns A promise that resolves with the top table recommendations.
   */
  public async getRecommendations(body: TableRecommendationRequest) {
    this.validator.validateRequest(body);

    const recommendations =
      await tableRecommendationService.getTableRecommendations(body);
    return { recommendations };
  }
}

export const tableRecommendationController =
  new TableRecommendationController();
