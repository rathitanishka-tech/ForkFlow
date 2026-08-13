import { prisma as db } from "@/lib/prisma";
import { OrderStatus, TableStatus } from "@prisma/client";
import type { DashboardAnalytics } from "./analytics.types";

function formatReservationStatus(status: string): string {
  switch (status) {
    case "CONFIRMED":
      return "Confirmed";
    case "SEATED":
      return "Seated";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    case "NO_SHOW":
      return "No Show";
    case "PENDING":
    default:
      return "Pending";
  }
}

class AnalyticsService {
  /**
   * Fetches and computes all data required for the restaurant's analytics dashboard.
   * @returns {Promise<DashboardAnalytics>} The aggregated dashboard analytics data.
   */
  public async getDashboardAnalytics(
    restaurantId: string,
  ): Promise<DashboardAnalytics> {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(startOfToday.getDate() - 6);

    const [
      todaysRevenueResult,
      todaysOrdersCount,
      pendingOrdersCount,
      occupiedTablesCount,
      todaysCompletedOrdersCount,
      preparingOrdersCount,
      readyOrdersCount,
      orderItems,
      completedOrdersLast7Days,
      recentOrders,
      todaysReservationsCount,
      restaurantsCount,
      tables,
      recentReservations,
    ] = await db.$transaction([
      db.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          restaurantId,
          status: OrderStatus.SERVED,
          createdAt: {
            gte: startOfToday,
          },
        },
      }),
      db.order.count({
        where: {
          restaurantId,
          createdAt: {
            gte: startOfToday,
          },
        },
      }),
      db.order.count({
        where: {
          restaurantId,
          status: OrderStatus.PENDING,
        },
      }),
      db.table.count({
        where: {
          floor: {
            restaurantId,
          },
          status: TableStatus.OCCUPIED,
        },
      }),
      db.order.count({
        where: {
          restaurantId,
          status: OrderStatus.SERVED,
          createdAt: { gte: startOfToday },
        },
      }),
      db.order.count({
        where: { restaurantId, status: OrderStatus.PREPARING },
      }),
      db.order.count({ where: { restaurantId, status: OrderStatus.READY } }),
      db.orderItem.findMany({
        where: {
          order: {
            restaurantId,
          },
        },
        select: {
          quantity: true,
          menuItem: {
            select: {
              name: true,
            },
          },
        },
      }),
      db.order.findMany({
        where: {
          restaurantId,
          status: OrderStatus.SERVED,
          createdAt: { gte: sevenDaysAgo },
        },
        select: { totalAmount: true, createdAt: true },
      }),
      db.order.findMany({
        where: {
          restaurantId,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          tableId: true,
          table: { select: { number: true } },
        },
      }),
      db.reservation.count({
        where: {
          restaurantId,
          reservationTime: {
            gte: startOfToday,
            lt: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      }),

      db.restaurant.count({
        where: {
          id: restaurantId,
        },
      }),
      db.table.findMany({
        where: {
          floor: { restaurantId },
        },
        select: {
          id: true,
          number: true,
          status: true,
        },
        orderBy: {
          number: "asc",
        },
      }),
      db.reservation.findMany({
        where: {
          restaurantId,
        },
        orderBy: {
          reservationTime: "desc",
        },
        take: 5,
        include: {
          guest: true,
          table: true,
        },
      }),
    ]);

    let bestSellingItem: { name: string; count: number } | null = null;
    if (orderItems.length > 0) {
      const itemCounts = new Map<string, number>();
      orderItems.forEach(
        (item: {
          quantity: number;
          menuItem: {
            name: string;
          };
        }) => {
          const currentCount = itemCounts.get(item.menuItem.name) ?? 0;
          itemCounts.set(item.menuItem.name, currentCount + item.quantity);
        },
      );

      if (itemCounts.size > 0) {
        const topItemEntry = [...itemCounts.entries()].reduce((a, b) =>
          b[1] > a[1] ? b : a,
        );
        if (topItemEntry) {
          bestSellingItem = {
            name: topItemEntry[0],
            count: topItemEntry[1],
          };
        }
      }
    }

    const revenueByDay = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfToday);
      date.setDate(startOfToday.getDate() - i);
      revenueByDay.set(date.toISOString().split("T")[0], 0);
    }
    completedOrdersLast7Days.forEach(
      (order: { createdAt: Date; totalAmount: number }) => {
        const dateStr = order.createdAt.toISOString().split("T")[0];
        revenueByDay.set(
          dateStr,
          (revenueByDay.get(dateStr) ?? 0) + order.totalAmount,
        );
      },
    );
    const last7DaysRevenue = Array.from(revenueByDay.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const todaysRevenue = todaysRevenueResult._sum?.totalAmount ?? 0;
    const averageOrderValue =
      todaysOrdersCount > 0 ? todaysRevenue / todaysOrdersCount : 0;

    const orderCompletionRate =
      todaysOrdersCount > 0
        ? (todaysCompletedOrdersCount / todaysOrdersCount) * 100
        : 0;

    return {
      todaysRevenue,
      todaysOrdersCount,
      pendingOrdersCount,
      occupiedTablesCount,
      reservationsTodayCount: todaysReservationsCount,
      restaurantsCount,
      averageOrderValue,
      orderCompletionRate,
      kitchenWorkload: {
        pending: pendingOrdersCount,
        preparing: preparingOrdersCount,
        ready: readyOrdersCount,
      },
      bestSellingItem,
      last7DaysRevenue,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount || 0,
        createdAt: order.createdAt,
        table: {
          number: order.table?.number ?? `Table ${order.tableId.slice(0, 8)}`,
        },
      })),
      recentReservations: recentReservations.map((reservation) => ({
        id: reservation.id,
        guest: reservation.guest?.name ?? "Guest",
        table: reservation.table.number,
        time: new Date(reservation.reservationTime).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        guests: reservation.partySize,
        status: formatReservationStatus(reservation.status),
      })),
      tableStatuses: tables.map((table) => ({
        id: table.id,
        number: table.number,
        status: table.status,
      })),
    };
  }
}

export const analyticsService = new AnalyticsService();
