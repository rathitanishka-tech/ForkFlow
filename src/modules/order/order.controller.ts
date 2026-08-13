import { OrderFilters, OrderListResponse, OrderResponse } from "./order.types";
import { OrderService } from "./order.service";
import { createOrderSchema, updateOrderSchema } from "./order.validator";

/**
 * Controller for handling order-related API requests.
 * It acts as a thin layer, validating input and delegating
 * business logic to the OrderService.
 *
 * All methods that create an order receive the server-resolved restaurantId
 * to enforce data isolation.
 */
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Handles the creation of a new order.
   * The restaurantId is injected server-side; any client-supplied value is ignored.
   * @param input - The raw input for creating an order.
   * @param restaurantId - The server-resolved restaurant ID.
   */
  async create(input: unknown, restaurantId: string): Promise<OrderResponse> {
    const validatedInput = createOrderSchema.parse(input);
    return this.orderService.createOrder({ ...validatedInput, restaurantId });
  }

  /**
   * Handles listing orders with optional filters and pagination.
   * @param filters - The filtering and pagination criteria.
   */
  async list(filters: OrderFilters): Promise<OrderListResponse> {
    return this.orderService.getOrders(filters);
  }

  /**
   * Handles retrieving a single order by its ID, scoped to the given restaurant.
   * @param id - The ID of the order.
   * @param restaurantId - The server-resolved restaurant ID.
   */
  async getById(
    id: string,
    restaurantId: string,
  ): Promise<OrderResponse | null> {
    return this.orderService.getOrderById(id, restaurantId);
  }

  /**
   * Handles updating an order's status, scoped to the given restaurant.
   * @param id - The ID of the order to update.
   * @param input - The raw input for updating the order.
   * @param restaurantId - The server-resolved restaurant ID.
   */
  async update(
    id: string,
    input: unknown,
    restaurantId: string,
  ): Promise<OrderResponse> {
    const validatedInput = updateOrderSchema.parse(input);
    return this.orderService.updateOrder(id, validatedInput, restaurantId);
  }

  /**
   * Handles deleting an order, scoped to the given restaurant.
   * @param id - The ID of the order to delete.
   * @param restaurantId - The server-resolved restaurant ID.
   */
  async delete(id: string, restaurantId: string): Promise<void> {
    return this.orderService.deleteOrder(id, restaurantId);
  }
}
