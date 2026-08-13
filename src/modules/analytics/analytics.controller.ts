import { analyticsService } from "./analytics.service";

class AnalyticsController {
  public async getDashboardAnalytics(restaurantId: string) {
    try {
      return await analyticsService.getDashboardAnalytics(restaurantId);
    } catch (error) {
      console.error("FULL ANALYTICS ERROR:");
      console.dir(error, { depth: null });
      throw error;
    }
  }
}

export const analyticsController = new AnalyticsController();
