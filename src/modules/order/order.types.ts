/**
 * Represents the possible statuses of an order.
 */
export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "CANCELLED";

/**
 * Represents a single item within a returned order.
 */
export interface OrderItemResponse {
  id: string;
  menuItemId: string;
  menuItemName: string;
  menuItemImage: string | null;
  quantity: number;
  price: number;
}

/**
 * Represents the detailed response for a single order.
 */
export interface OrderResponse {
  id: string;
  restaurantId: string;
  tableId: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItemResponse[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a summarized version of an order, suitable for lists.
 */
export interface OrderSummary {
  id: string;
  tableId: string;
  tableNumber: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  createdAt: Date;
}

/**
 * Defines the available filters for querying a list of orders.
 */
export interface OrderFilters {
  restaurantId?: string;
  tableId?: string;
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

/**
 * Represents the response for a paginated list of orders.
 */
export interface OrderListResponse {
  data: OrderSummary[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Represents key metrics and statistics about orders.
 */
export interface OrderMetrics {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
  servedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}
