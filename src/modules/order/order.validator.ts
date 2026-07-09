import { OrderStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schema for a single item within an order.
 */
const orderItemSchema = z.object({
  menuItemId: z.string().uuid({ message: "Invalid menu item ID." }),
  quantity: z
    .number()
    .int()
    .min(1, { message: "Quantity must be at least 1." })
    .max(20, { message: "Quantity cannot be more than 20." }),
});

/**
 * Schema for creating a new order.
 */
export const createOrderSchema = z.object({
  restaurantId: z.string().uuid({ message: "Invalid restaurant ID." }),
  tableId: z.string().uuid({ message: "Invalid table ID." }),
  items: z
    .array(orderItemSchema)
    .min(1, { message: "Order must contain at least one item." }),
});

export const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
