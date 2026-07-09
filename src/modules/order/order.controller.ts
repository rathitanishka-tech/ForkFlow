import { OrderFilters, OrderListResponse, OrderResponse } from "./order.types";
import { OrderService } from "./order.service";
import { createOrderSchema, updateOrderSchema } from "./order.validator";

/**
 * Controller for handling order-related API requests.
 * It acts as a thin layer, validating input and delegating
 * business logic to the OrderService.
 */
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Handles the creation of a new order.
   * @param input - The raw input for creating an order.
   */
  async create(input: unknown): Promise<OrderResponse> {
    const validatedInput = createOrderSchema.parse(input);
    return this.orderService.createOrder(validatedInput);
  }

  /**
   * Handles listing orders with optional filters and pagination.
   * @param filters - The filtering and pagination criteria.
   */
  async list(filters: OrderFilters): Promise<OrderListResponse> {
    // Filters are passed directly; the service layer is responsible for defaults.
    return this.orderService.getOrders(filters);
  }

  /**
   * Handles retrieving a single order by its ID.
   * @param id - The ID of the order.
   */
  async getById(id: string): Promise<OrderResponse | null> {
    return this.orderService.getOrderById(id);
  }

  /**
   * Handles updating an order's status.
   * @param id - The ID of the order to update.
   * @param input - The raw input for updating the order.
   */
  async update(id: string, input: unknown): Promise<OrderResponse> {
    const validatedInput = updateOrderSchema.parse(input);
    return this.orderService.updateOrder(id, validatedInput);
  }

  /**
   * Handles deleting an order.
   * @param id - The ID of the order to delete.
   */
  async delete(id: string): Promise<void> {
    return this.orderService.deleteOrder(id);
  }
}
