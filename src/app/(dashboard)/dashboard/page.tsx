import { InsightCard } from "@/components/dashboard/insight-card";
import { KitchenTimeline } from "@/components/dashboard/kitchen-timeline";
import { LiveTableGrid } from "@/components/dashboard/live-table-grid";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { ReservationTable } from "@/components/dashboard/reservation-table";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  CalendarCheck,
  ChefHat,
  Clock3,
  IndianRupee,
  Package,
  Plus,
  Store,
  Table2,
} from "lucide-react";

const quickActions = [
  { label: "New Reservation", icon: Plus },
  { label: "Manage Tables", icon: Table2 },
  { label: "Kitchen Display", icon: ChefHat },
  { label: "Inventory", icon: Package },
];

const tableStatuses = [
  "Available",
  "Reserved",
  "Occupied",
  "Available",
  "Occupied",
  "Maintenance",
  "Reserved",
  "Available",
  "Occupied",
  "Available",
  "Reserved",
  "Occupied",
  "Available",
  "Occupied",
  "Available",
  "Reserved",
  "Occupied",
  "Maintenance",
  "Available",
  "Occupied",
  "Reserved",
  "Available",
  "Occupied",
  "Available",
  "Reserved",
  "Occupied",
  "Available",
  "Maintenance",
  "Occupied",
  "Available",
];

const insights = [
  { label: "Most booked table", value: "T12", detail: "6 reservations today" },
  { label: "Peak hour", value: "8:00 PM", detail: "Highest booking density" },
  {
    label: "Average dining time",
    value: "74 min",
    detail: "Across seated guests",
  },
  { label: "Cancellation rate", value: "3.2%", detail: "Lower than last week" },
];

async function getDashboardData() {
  try {
    // In a real app, this URL would come from environment variables
    const res = await fetch("http://localhost:3000/api/dashboard", {
      cache: "no-store", // Ensure fresh data on every request
    });

    if (!res.ok) {
      console.error("Failed to fetch dashboard data:", res.statusText);
      return null;
    }

    return res.json();
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

  const kpis = [
    {
      label: "Restaurants",
      value: data?.kpis?.restaurants?.value ?? "0",
      subtitle: data?.kpis?.restaurants?.subtitle ?? "N/A",
      icon: Store,
    },
    {
      label: "Today's Reservations",
      value: data?.kpis?.reservations?.value ?? "0",
      subtitle: data?.kpis?.reservations?.subtitle ?? "N/A",
      icon: CalendarCheck,
    },
    {
      label: "Occupied Tables",
      value: data?.kpis?.occupiedTables?.value ?? "0 / 0",
      subtitle: data?.kpis?.occupiedTables?.subtitle ?? "N/A",
      icon: Table2,
    },
    {
      label: "Revenue",
      value: data?.kpis?.revenue?.value ?? "₹0",
      subtitle: data?.kpis?.revenue?.subtitle ?? "N/A",
      icon: IndianRupee,
    },
  ];

  const reservations = data?.recentReservations ?? [];
  const kitchenActivity = data?.kitchenActivity ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal text-neutral-950">
            Good Morning 👋
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Here's what's happening across your restaurants today.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-600 shadow-sm">
          <Clock3 className="h-4 w-4 text-neutral-400" aria-hidden="true" />
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
            <h2 className="text-sm font-semibold text-neutral-950">
              Today's Insights
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
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
