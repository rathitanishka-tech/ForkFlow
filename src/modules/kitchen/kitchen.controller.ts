import { KitchenService } from "./kitchen.service";
import {
  KitchenBoard,
  KitchenFilters,
  KitchenOrder,
  KitchenOrderStatus,
} from "./kitchen.types";

/**
 * Controller for handling kitchen-related API requests.
 * It acts as a thin layer, delegating business logic to the KitchenService.
 *
 * All methods that access orders receive the server-resolved restaurantId
 * to enforce data isolation.
 */
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  /**
   * Handles retrieving the kitchen board data.
   * @param filters - The filtering criteria for the board (must include restaurantId).
   */
  async getBoard(filters: KitchenFilters): Promise<KitchenBoard> {
    return this.kitchenService.getKitchenBoard(filters);
  }

  /**
   * Handles updating an order's status from the kitchen.
   * The order must belong to the given restaurant.
   * @param id - The ID of the order to update.
   * @param status - The new status for the order.
   * @param restaurantId - The server-resolved restaurant ID.
   */
  async updateStatus(
    id: string,
    status: KitchenOrderStatus,
    restaurantId: string,
  ): Promise<KitchenOrder> {
    return this.kitchenService.updateOrderStatus(id, status, restaurantId);
  }
}
