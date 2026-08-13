import { Prisma, PrismaClient, TableStatus } from "@prisma/client";
import { OrderFilters, OrderListResponse, OrderResponse } from "./order.types";
import { CreateOrderInput, UpdateOrderInput } from "./order.validator";
import { resolveMenuItemImage } from "../menu/menu.service";

/**
 * Service layer for handling order-related business logic.
 */
export class OrderService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Creates a new order in a transactional operation.
   * It verifies the existence of restaurant, table, and menu items,
   * calculates the total amount based on stored prices, and creates
   * the order and its items.
   *
   * On success, the associated table is automatically marked OCCUPIED
   * inside this same transaction.
   *
   * @param input - The data for creating the order (restaurantId is server-resolved).
   * @returns The newly created order details.
   */
  async createOrder(input: CreateOrderInput): Promise<OrderResponse> {
    const { restaurantId, tableId, items } = input;

    const menuItemIds = items.map((item) => item.menuItemId);

    return this.prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.findUnique({
        where: { id: restaurantId },
      });
      if (!restaurant) {
        throw new Error("Restaurant not found.");
      }
      const table = await tx.table.findUnique({
        where: { id: tableId },
        include: { floor: true },
      });

      if (!table || table.floor.restaurantId !== restaurantId) {
        throw new Error(
          "Table not found or does not belong to the specified restaurant.",
        );
      }

      const menuItems = await tx.menuItem.findMany({
        where: {
          id: { in: menuItemIds },
          isAvailable: true,
          restaurantId: restaurantId,
        },
      });

      if (menuItems.length !== menuItemIds.length) {
        throw new Error("One or more menu items are invalid or not available.");
      }

      const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));
      let totalAmount = 0;

      const orderItemsData = items.map((item) => {
        const menuItem = menuItemMap.get(item.menuItemId);
        if (!menuItem) {
          throw new Error(`Menu item ${item.menuItemId} not found.`);
        }
        const itemPrice = menuItem.price * item.quantity;
        totalAmount += itemPrice;
        return {
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: menuItem.price,
        };
      });

      const newOrder = await tx.order.create({
        data: {
          restaurantId,
          tableId,
          totalAmount,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      });

      await tx.table.update({
        where: { id: tableId },
        data: { status: TableStatus.OCCUPIED },
      });

      return {
        ...newOrder,
        items: newOrder.items.map((item) => ({
          id: item.id,
          menuItemId: item.menuItemId,
          menuItemName: item.menuItem.name,
          menuItemImage: resolveMenuItemImage(
            item.menuItem.name,
            item.menuItem.image,
          ),
          quantity: item.quantity,
          price: item.price,
        })),
      };
    });
  }

  /**
   * Retrieves a paginated and filtered list of orders.
   * @param filters - The filtering and pagination criteria.
   * @returns A paginated list of order summaries.
   */
  async getOrders(filters: OrderFilters): Promise<OrderListResponse> {
    const { restaurantId, tableId, status, page = 1, limit = 10 } = filters;

    const where: Prisma.OrderWhereInput = {
      restaurantId,
      tableId,
      status,
    };

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: {
          table: {
            select: { number: true },
          },
          _count: {
            select: { items: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    const data = orders.map((order) => ({
      id: order.id,
      tableId: order.tableId,
      tableNumber: order.table.number,
      status: order.status,
      totalAmount: order.totalAmount,
      itemCount: order._count.items,
      createdAt: order.createdAt,
    }));

    return { data, total, page, limit };
  }

  /**
   * Retrieves a single order by its ID, scoped to the given restaurant.
   * @param id - The ID of the order to retrieve.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The detailed order response, or null if not found.
   */
  async getOrderById(
    id: string,
    restaurantId: string,
  ): Promise<OrderResponse | null> {
    const order = await this.prisma.order.findFirst({
      where: { id, restaurantId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) {
      return null;
    }

    return {
      ...order,
      items: order.items.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        menuItemName: item.menuItem.name,
        menuItemImage: resolveMenuItemImage(
          item.menuItem.name,
          item.menuItem.image,
        ),
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }

  /**
   * Updates the status of an existing order, scoped to the given restaurant.
   * @param id - The ID of the order to update.
   * @param input - The data for updating the order status.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated order details.
   */
  async updateOrder(
    id: string,
    input: UpdateOrderInput,
    restaurantId: string,
  ): Promise<OrderResponse> {
    const existingOrder = await this.prisma.order.findFirst({
      where: { id, restaurantId },
      select: { id: true },
    });

    if (!existingOrder) {
      throw new Error(`Order with ID ${id} not found.`);
    }

    await this.prisma.order.update({
      where: { id },
      data: { status: input.status },
    });

    return this.getOrderById(id, restaurantId) as Promise<OrderResponse>;
  }

  /**
   * Permanently deletes an order and its associated items, scoped to the given restaurant.
   * @param id - The ID of the order to delete.
   * @param restaurantId - The server-resolved restaurant ID.
   */
  async deleteOrder(id: string, restaurantId: string): Promise<void> {
    const existingOrder = await this.prisma.order.findFirst({
      where: { id, restaurantId },
      select: { id: true },
    });

    if (!existingOrder) {
      throw new Error(`Order with ID ${id} not found.`);
    }

    await this.prisma.order.delete({
      where: { id },
    });
  }
}
