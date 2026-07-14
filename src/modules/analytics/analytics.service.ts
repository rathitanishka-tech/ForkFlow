import { prisma as db } from "@/lib/prisma";
import { OrderStatus, TableStatus } from "@prisma/client";
import type { DashboardAnalytics, RecentOrder } from "./analytics.types";

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
  public async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(startOfToday.getDate() - 6);

    // Batch Prisma queries to run in parallel
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
      recentReservations,
    ] = await db.$transaction([
      // 1. Today's Revenue
      db.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: OrderStatus.SERVED,
          createdAt: { gte: startOfToday },
        },
      }),
      // 2. Today's Orders Count
      db.order.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      // 3. Pending Orders Count
      db.order.count({
        where: { status: OrderStatus.PENDING },
      }),
      // 4. Occupied Tables Count
      db.table.count({
        where: { status: TableStatus.OCCUPIED },
      }),
      // 5. Today's Completed Orders Count (for completion rate)
      db.order.count({
        where: {
          status: OrderStatus.SERVED,
          createdAt: { gte: startOfToday },
        },
      }),
      // 6. Preparing Orders Count (for kitchen workload)
      db.order.count({ where: { status: OrderStatus.PREPARING } }),
      // 7. Ready Orders Count (for kitchen workload)
      db.order.count({ where: { status: OrderStatus.READY } }),
      // 5. Best Selling Item
      db.orderItem.findMany({
        select: {
          quantity: true,
          menuItem: {
            select: {
              name: true,
            },
          },
        },
      }),
      // 6. Last 7 Days Revenue
      db.order.findMany({
        where: {
          status: OrderStatus.SERVED,
          createdAt: { gte: sevenDaysAgo },
        },
        select: { totalAmount: true, createdAt: true },
      }),
      // 7. Recent Orders
      db.order.findMany({
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
      // 8. Today's reservations count
      db.reservation.count({
        where: {
          reservationDate: {
            gte: startOfToday,
            lt: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      }),

      // 9. Restaurant count
      db.restaurant.count(),
      // 10. Recent reservations
      db.reservation.findMany({
        orderBy: { reservationDate: "desc" },
        take: 5,
        select: {
          customerName: true,
          reservationDate: true,
          guests: true,
          status: true,
          table: true,
        },
      }),
    ]);

    // Process best selling item from all order items
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

    // Process last 7 days revenue
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

    // Process new metrics
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
        guest: reservation.customerName || "Guest",
        table: reservation.table?.number ?? "Pending",
        time: new Date(reservation.reservationDate).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        guests: reservation.guests ?? 0,
        status: formatReservationStatus(String(reservation.status)),
      })),
    };
  }
}

export const analyticsService = new AnalyticsService();
