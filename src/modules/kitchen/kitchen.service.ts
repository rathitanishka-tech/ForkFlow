import { OrderStatus, Prisma, PrismaClient, TableStatus } from "@prisma/client";
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
        createdAt: "asc",
      },
    });

    const kitchenBoard: KitchenBoard = {
      pending: [],
      preparing: [],
      ready: [],
      served: [],
    };

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
   * Updates the status of a specific order, scoped to the given restaurant.
   *
   * When the order transitions to SERVED — the final status in the
   * existing kitchen workflow — the associated table is released back
   * to AVAILABLE, but only if no other active order (anything not yet
   * SERVED or CANCELLED) remains open on that same table.
   *
   * The status update, the active-order check, and the table release all
   * happen inside one transaction, so they commit or roll back together.
   *
   * @param orderId - The ID of the order to update.
   * @param status - The new status for the order.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated KitchenOrder.
   */
  async updateOrderStatus(
    orderId: string,
    status: KitchenOrderStatus,
    restaurantId: string,
  ): Promise<KitchenOrder> {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, restaurantId },
        select: { id: true, tableId: true },
      });

      if (!order) {
        throw new Error(`Order with ID ${orderId} not found.`);
      }

      const updatedOrder = await tx.order.update({
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

      if (status === "SERVED") {
        const activeOrderCount = await tx.order.count({
          where: {
            tableId: order.tableId,
            id: { not: order.id },
            status: { notIn: [OrderStatus.SERVED, OrderStatus.CANCELLED] },
          },
        });

        if (activeOrderCount === 0) {
          await tx.table.update({
            where: { id: order.tableId },
            data: { status: TableStatus.AVAILABLE },
          });
        }
      }

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
    });
  }
}
