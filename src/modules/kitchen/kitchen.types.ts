/**
 * Represents the possible statuses of an order relevant to the kitchen.
 */
export type KitchenOrderStatus = "PENDING" | "PREPARING" | "READY" | "SERVED";

/**
 * Represents a single item within a kitchen order.
 */
export interface KitchenOrderItem {
  menuItemName: string;
  quantity: number;
}

/**
 * Represents a simplified order view for the Kitchen Display System.
 */
export interface KitchenOrder {
  id: string;
  tableNumber: string;
  status: KitchenOrderStatus;
  totalAmount: number;
  createdAt: Date;
  items: KitchenOrderItem[];
}

/**
 * Represents the entire kitchen board, with orders categorized by status.
 */
export interface KitchenBoard {
  pending: KitchenOrder[];
  preparing: KitchenOrder[];
  ready: KitchenOrder[];
  served: KitchenOrder[];
}

/**
 * Represents key performance metrics for the kitchen.
 */
export interface KitchenMetrics {
  pendingCount: number;
  preparingCount: number;
  readyCount: number;
  servedCount: number;
  /**
   * Average time in seconds from PENDING to READY for completed orders.
   */
  averagePreparationTime: number;
}

/**
 * Defines the available filters for querying kitchen-related data.
 */
export interface KitchenFilters {
  /**
   * The ID of the restaurant to filter by.
   */
  restaurantId: string;
  /**
   * Optionally filter by a specific order status.
   */
  status?: KitchenOrderStatus;
}
