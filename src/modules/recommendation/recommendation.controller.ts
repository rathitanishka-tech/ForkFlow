import { recommendationService } from "./recommendation.service";
import { RecommendationValidator } from "./recommendation.validator";

class RecommendationController {
  private validator = new RecommendationValidator();

  /**
   * Handles the request to get menu recommendations.
   * @param menuItemId The ID of the menu item from the request query.
   * @returns A promise that resolves with an array of recommended items.
   */
  public async getRecommendations(menuItemId: string | null) {
    this.validator.validateMenuItemId(menuItemId);

    // The validator ensures menuItemId is a string at this point.
    const recommendations = await recommendationService.getRecommendations(
      menuItemId!,
    );
    return recommendations;
  }
}

export const recommendationController = new RecommendationController();
