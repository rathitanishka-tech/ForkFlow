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
 */
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  /**
   * Handles retrieving the kitchen board data.
   * @param filters - The filtering criteria for the board.
   */
  async getBoard(filters: KitchenFilters): Promise<KitchenBoard> {
    return this.kitchenService.getKitchenBoard(filters);
  }

  /**
   * Handles updating an order's status from the kitchen.
   * @param id - The ID of the order to update.
   * @param status - The new status for the order.
   */
  async updateStatus(
    id: string,
    status: KitchenOrderStatus,
  ): Promise<KitchenOrder> {
    return this.kitchenService.updateOrderStatus(id, status);
  }
}
