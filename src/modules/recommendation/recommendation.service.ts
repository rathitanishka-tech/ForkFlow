import { prisma as db } from "@/lib/prisma";
import type { RecommendedMenuItem } from "./recommendation.types";

class RecommendationService {
  private readonly RECOMMENDATION_LIMIT = 4;

  /**
   * Generates menu item recommendations based on order history.
   * It first attempts to find items frequently ordered with the given item.
   * If no co-order history exists, it falls back to recommending top-selling items.
   *
   * @param menuItemId The ID of the menu item to get recommendations for.
   * @returns A promise that resolves to an array of recommended menu items.
   */
  public async getRecommendations(
    menuItemId: string,
  ): Promise<RecommendedMenuItem[]> {
    // Find orders that contain the specified menu item.
    const ordersWithItem = await db.order.findMany({
      where: { items: { some: { menuItemId } } },
      select: { id: true },
    });

    if (ordersWithItem.length === 0) {
      // If the item has never been ordered, fall back to top sellers.
      return this.getTopSellingItems(menuItemId);
    }

    const orderIds = ordersWithItem.map((order) => order.id);

    // Find all items that were ordered alongside the specified item.
    const coOrderedItems = await db.orderItem.groupBy({
      by: ["menuItemId"],
      where: {
        orderId: { in: orderIds },
        NOT: { menuItemId }, // Exclude the original item
      },
      _count: {
        menuItemId: true,
      },
      orderBy: {
        _count: {
          menuItemId: "desc",
        },
      },
      take: this.RECOMMENDATION_LIMIT,
    });

    if (coOrderedItems.length === 0) {
      // If no items were co-ordered, fall back to top sellers.
      return this.getTopSellingItems(menuItemId);
    }

    const recommendedItemIds = coOrderedItems.map((item) => item.menuItemId);

    // Fetch the full details of the recommended items.
    return db.menuItem.findMany({
      where: { id: { in: recommendedItemIds } },
      select: { id: true, name: true, price: true, image: true },
    });
  }

  /**
   * Fetches the overall top-selling menu items, excluding the specified item.
   * This serves as a fallback recommendation strategy.
   *
   * @param excludeMenuItemId The menu item ID to exclude from the results.
   * @returns A promise that resolves to an array of top-selling menu items.
   */
  private async getTopSellingItems(
    excludeMenuItemId: string,
  ): Promise<RecommendedMenuItem[]> {
    const topItems = await db.orderItem.groupBy({
      by: ["menuItemId"],
      where: {
        NOT: { menuItemId: excludeMenuItemId },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: this.RECOMMENDATION_LIMIT,
    });

    const topItemIds = topItems.map((item) => item.menuItemId);

    return db.menuItem.findMany({
      where: { id: { in: topItemIds } },
      select: { id: true, name: true, price: true, image: true },
    });
  }
}

export const recommendationService = new RecommendationService();
