import { OrderStatus, Prisma, PrismaClient } from "@prisma/client";
import {
  KitchenBoard,
  KitchenFilters,
  KitchenOrder,
  KitchenOrderStatus,
} from "./kitchen.types";

/**
 * Service layer for handling business logic related to the Kitchen Display System.
 */
export class KitchenService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Retrieves and organizes orders for the kitchen display board.
   * @param filters - The filtering criteria, primarily the restaurant ID.
   * @returns A KitchenBoard object with orders grouped by status.
   */
  async getKitchenBoard(filters: KitchenFilters): Promise<KitchenBoard> {
    const kitchenStatuses: KitchenOrderStatus[] = [
      "PENDING",
      "PREPARING",
      "READY",
      "SERVED",
    ];

    const where: Prisma.OrderWhereInput = {
      restaurantId: filters.restaurantId,
      // If a specific status is provided in filters, use it. Otherwise, fetch all relevant kitchen statuses.
      // This also implicitly excludes 'CANCELLED' orders.
      status: filters.status ?? { in: kitchenStatuses },
    };

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        table: {
          select: { number: true },
        },
        items: {
          include: {
            menuItem: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc", // Oldest orders first
      },
    });

    // Initialize the kitchen board structure
    const kitchenBoard: KitchenBoard = {
      pending: [],
      preparing: [],
      ready: [],
      served: [],
    };

    // Map and group orders into the kitchen board
    for (const order of orders) {
      const kitchenOrder: KitchenOrder = {
        id: order.id,
        tableNumber: order.table.number,
        status: order.status as KitchenOrderStatus,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          menuItemName: item.menuItem.name,
          quantity: item.quantity,
        })),
      };

      // Group the order into the correct status list
      switch (kitchenOrder.status) {
        case "PENDING":
          kitchenBoard.pending.push(kitchenOrder);
          break;

        case "PREPARING":
          kitchenBoard.preparing.push(kitchenOrder);
          break;

        case "READY":
          kitchenBoard.ready.push(kitchenOrder);
          break;

        case "SERVED":
          kitchenBoard.served.push(kitchenOrder);
          break;
      }
    }

    return kitchenBoard;
  }

  /**
   * Updates the status of a specific order.
   * @param orderId - The ID of the order to update.
   * @param status - The new status for the order.
   * @returns The updated KitchenOrder.
   */
  async updateOrderStatus(
    orderId: string,
    status: KitchenOrderStatus,
  ): Promise<KitchenOrder> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true }, // Only need to select ID to confirm existence
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        table: {
          select: { number: true },
        },
        items: {
          include: {
            menuItem: {
              select: { name: true },
            },
          },
        },
      },
    });

    return {
      id: updatedOrder.id,
      tableNumber: updatedOrder.table.number,
      status: updatedOrder.status as KitchenOrderStatus,
      totalAmount: updatedOrder.totalAmount,
      createdAt: updatedOrder.createdAt,
      items: updatedOrder.items.map((item) => ({
        menuItemName: item.menuItem.name,
        quantity: item.quantity,
      })),
    };
  }
}
