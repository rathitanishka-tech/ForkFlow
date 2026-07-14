import { analyticsService } from "./analytics.service";

class AnalyticsController {
  /**
   * Handles the request to get dashboard analytics data.
   * It calls the service to fetch the data and returns it.
   * @returns A promise that resolves with the dashboard analytics data.
   */
  public async getDashboardAnalytics() {
    try {
      const analyticsData = await analyticsService.getDashboardAnalytics();
      return analyticsData;
    } catch (error) {
      console.error("FULL ANALYTICS ERROR:");
      console.dir(error, { depth: null });

      throw error;
    }
  }
}

export const analyticsController = new AnalyticsController();
