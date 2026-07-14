import type { Order, OrderItem, MenuItem } from "@prisma/client";

/**
 * Represents a simplified recent order for display on the dashboard.
 */
export type RecentOrder = Pick<
  Order,
  "id" | "status" | "totalAmount" | "createdAt"
> & {
  table: {
    number: string;
  };
};

/**
 * The main data structure for the analytics dashboard.
 */
export interface ReservationSummary {
  guest: string;
  table: string;
  time: string;
  guests: number;
  status: string;
}

export interface DashboardAnalytics {
  todaysRevenue: number;
  todaysOrdersCount: number;
  pendingOrdersCount: number;
  averageOrderValue: number;
  orderCompletionRate: number;
  kitchenWorkload: {
    pending: number;
    preparing: number;
    ready: number;
  };
  occupiedTablesCount: number;
  reservationsTodayCount: number;
  restaurantsCount: number;
  bestSellingItem: { name: string; count: number } | null;
  last7DaysRevenue: { date: string; revenue: number }[];
  recentOrders: RecentOrder[];
  recentReservations: ReservationSummary[];
}
