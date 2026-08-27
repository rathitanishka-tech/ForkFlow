import { InsightCard } from "@/app/dashboard/insight-card";
import { KitchenTimeline } from "@/app/dashboard/kitchen-timeline";
import { LiveTableGrid } from "@/app/dashboard/live-table-grid";
import { QuickActionCard } from "@/app/dashboard/quick-action-card";
import { ReservationTable } from "@/app/dashboard/reservation-table";
import { StatCard } from "@/app/dashboard/stat-card";
import { analyticsController } from "@/modules/analytics/analytics.controller";
import {
  CalendarCheck,
  ChefHat,
  Clock3,
  QrCode,
  BarChart3,
  IndianRupee,
  Plus,
  Store,
  Table2,
} from "lucide-react";
import { getCurrentRestaurant } from "@/lib/server-restaurant";

export const dynamic = "force-dynamic";

const quickActions = [
  { label: "Reservations", icon: Plus, href: "/dashboard/reservations" },
  { label: "Generate QR", icon: QrCode, href: "/dashboard/qr" },
  { label: "Open Kitchen", icon: ChefHat, href: "/dashboard/kitchen" },
  { label: "View Analytics", icon: BarChart3, href: "/dashboard/analytics" },
];

async function getDashboardData() {
  try {
    const restaurant = await getCurrentRestaurant();

    return await analyticsController.getDashboardAnalytics(restaurant.id);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const data = await getDashboardData();
  const tableStatuses = data?.tableStatuses ?? [];

  const kpis = [
    {
      label: "Restaurants",
      value: data?.restaurantsCount?.toString() ?? "0",
      subtitle: "Active locations",
      icon: Store,
    },
    {
      label: "Today's Reservations",
      value: data?.reservationsTodayCount?.toString() ?? "0",
      subtitle: "Upcoming bookings",
      icon: CalendarCheck,
    },
    {
      label: "Occupied Tables",
      value: data?.occupiedTablesCount?.toString() ?? "0",
      subtitle: "Currently occupied",
      icon: Table2,
    },
    {
      label: "Revenue",
      value: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(data?.todaysRevenue ?? 0),
      subtitle: "Today's settled sales",
      icon: IndianRupee,
    },
  ];

  const reservations = data?.recentReservations ?? [];
  const kitchenActivity = data?.kitchenWorkload
    ? [
      {
        status: "Pending",
        table: `${data.kitchenWorkload.pending} orders`,
        detail: "Awaiting kitchen acknowledgement",
        tone: "bg-amber-500",
      },
      {
        status: "Preparing",
        table: `${data.kitchenWorkload.preparing} orders`,
        detail: "Currently being prepared",
        tone: "bg-sky-500",
      },
      {
        status: "Ready",
        table: `${data.kitchenWorkload.ready} orders`,
        detail: "Ready for pickup and delivery",
        tone: "bg-emerald-500",
      },
    ]
    : [];

  const insights = [
    {
      label: "Best selling item",
      value: data?.bestSellingItem?.name ?? "No recent sales",
      detail: data?.bestSellingItem
        ? `${data.bestSellingItem.count} orders`
        : "No sales data available",
    },
    {
      label: "Order completion",
      value: data?.orderCompletionRate
        ? `${Math.round(data.orderCompletionRate)}%`
        : "N/A",
      detail: "Completed orders compared to today's openings",
    },
    {
      label: "Average order value",
      value: data
        ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(data.averageOrderValue)
        : "N/A",
      detail: "Based on today's orders",
    },
    {
      label: "Restaurant capacity",
      value: data?.restaurantsCount?.toString() ?? "0",
      detail: "Active locations available",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-[1.6rem] border border-border bg-card px-5 py-5 shadow-xl sm:flex-row sm:items-end sm:px-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground">
            Good Morning
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening across your restaurants today.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-accent shadow-sm">
          <Clock3 className="h-4 w-4 text-accent" aria-hidden="true" />
          {currentDate}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <StatCard
            key={item.label}
            title={item.label}
            value={item.value}
            subtitle={item.subtitle}
            icon={item.icon}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <QuickActionCard
            key={action.label}
            title={action.label}
            icon={action.icon}
            href={action.href}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <LiveTableGrid tableStatuses={tableStatuses} />
          <ReservationTable reservations={reservations} />
          <KitchenTimeline kitchenActivity={kitchenActivity} />
        </div>

        <aside className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Today&apos;s Insights
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Signals from the current service window.
            </p>
          </div>

          {insights.map((insight) => (
            <InsightCard
              key={insight.label}
              title={insight.label}
              value={insight.value}
              description={insight.detail}
            />
          ))}
        </aside>
      </div>
    </div>
  );
}
