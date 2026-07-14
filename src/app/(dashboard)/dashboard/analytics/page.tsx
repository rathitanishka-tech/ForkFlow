"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Package, Clock, Users, Star } from "lucide-react";
import type {
  DashboardAnalytics,
  RecentOrder,
} from "@/modules/analytics/analytics.types";

/**
 * Formats a number as currency (USD).
 */
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

/**
 * Formats a date to a more readable string, e.g., "June 5, 5:30 PM".
 */
const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

/**
 * Renders the main analytics dashboard page for the restaurant.
 * It fetches data client-side and displays it in various cards and charts.
 */
export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data.");
        }
        const result: DashboardAnalytics = await response.json();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-[1.5rem] border-[#29443C] bg-[#10231E] shadow-[0_16px_45px_rgba(3,15,11,0.14)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle />
              Error Loading Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#8EA79D]">
              We couldn't load the analytics data. Please try refreshing the
              page.
            </p>
            <p className="mt-2 text-sm text-[#7F948B]">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#081E19] text-[#f8f5ef]">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <StatCard
            title="Today's Revenue"
            value={formatCurrency(data.todaysRevenue)}
            icon={<Package className="h-5 w-5 text-slate-500" />}
          />
          <StatCard
            title="Today's Orders"
            value={`+${data.todaysOrdersCount}`}
            icon={<Package className="h-5 w-5 text-slate-500" />}
          />
          <StatCard
            title="Pending Orders"
            value={data.pendingOrdersCount.toString()}
            icon={<Clock className="h-5 w-5 text-slate-500" />}
          />
          <StatCard
            title="Occupied Tables"
            value={data.occupiedTablesCount.toString()}
            icon={<Users className="h-5 w-5 text-slate-500" />}
          />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="rounded-[1.5rem] border-[#29443C] bg-[#10231E] shadow-[0_16px_45px_rgba(3,15,11,0.14)] xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#f8f5ef]">
                Revenue - Last 7 Days
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data.last7DaysRevenue}>
                  <XAxis
                    dataKey="date"
                    stroke="#8EA79D"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: string) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis
                    stroke="#8EA79D"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) => `$${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{
                      backgroundColor: "#10231E",
                      borderColor: "#29443C",
                    }}
                  />
                  <Bar
                    dataKey="revenue" // cyan-500
                    fill="#0f5b4c"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-4">
            <StatCard
              title="Best Selling Item"
              value={data.bestSellingItem?.name ?? "N/A"}
              description={
                data.bestSellingItem
                  ? `${data.bestSellingItem.count} units sold`
                  : "No sales data available"
              }
              icon={<Star className="h-5 w-5 text-slate-500" />}
            />
            <Card className="rounded-[1.5rem] border-[#29443C] bg-[#10231E] shadow-[0_16px_45px_rgba(3,15,11,0.14)]">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#f8f5ef]">
                  Recent Orders
                </CardTitle>
                <CardDescription className="text-sm text-[#8ea79d]">
                  The last 5 orders placed in the restaurant.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-[1.2rem] border border-[#29443C]">
                  <table className="w-full text-sm">
                    <thead className="bg-[#16342D]">
                      <tr className="border-b border-[#29443C]">
                        <th className="h-12 px-4 text-left align-middle font-medium text-[#8ea79d]">
                          Table
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-[#8ea79d]">
                          Status
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-[#8ea79d]">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {data.recentOrders.map((order: RecentOrder) => (
                        <tr
                          key={order.id}
                          className="border-b border-[#29443C] hover:bg-[#16342D] transition"
                        >
                          <td className="p-4 align-middle">
                            <div className="font-medium text-[#f8f5ef]">
                              Table {order.table.number}
                            </div>
                            <div className="text-xs text-[#7f948b]">
                              {formatDateTime(order.createdAt)}
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge
                              variant="outline"
                              className="border-[#29443C] text-[#8ea79d] bg-[#16342D]"
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-right align-middle text-[#F8F5EF]">
                            {formatCurrency(order.totalAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * A reusable card component for displaying a single statistic.
 */
const StatCard = ({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
}) => (
  <Card className="rounded-[1.5rem] border-[#29443C] bg-[#10231E] shadow-[0_12px_35px_rgba(3,15,11,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0F5B4C]/40">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-[#8ea79d]">
        {title}
      </CardTitle>
      <div className="text-[#d6b48c]">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-4xl font-extrabold text-[#f8f5ef]">{value}</div>
      {description && <p className="text-sm text-[#7f948b]">{description}</p>}
    </CardContent>
  </Card>
);

/**
 * Renders a skeleton loading state for the analytics page.
 */
const AnalyticsSkeleton = () => (
  <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-[138px] animate-pulse rounded-[1.5rem] border-[#29443C] bg-[#10231E] p-6"
        >
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-3/5 rounded-md bg-[#16342D]" />
          </div>
          <div>
            <div className="mt-2 h-10 w-1/2 rounded-md bg-[#16342D]" />
          </div>
        </div>
      ))}
    </div>
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <div className="animate-pulse rounded-[1.5rem] border-[#29443C] bg-[#10231E] xl:col-span-2">
        <div className="p-6">
          <div className="h-6 w-1/3 rounded-md bg-[#16342D]" />
        </div>
        <div className="p-6 pt-0">
          <div className="h-[350px] w-full rounded-xl bg-[#16342D]" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-[162px] animate-pulse rounded-[1.5rem] border-[#29443C] bg-[#10231E] p-6">
          <div className="p-6 pb-2">
            <div className="h-4 w-3/5 rounded-md bg-[#16342D]" />
          </div>
          <div className="space-y-2">
            <div className="h-10 w-4/5 rounded-md bg-[#16342D]" />
            <div className="h-4 w-2/5 rounded-md bg-[#16342D]" />
          </div>
        </div>
        <div className="flex-1 animate-pulse rounded-[1.5rem] border-[#29443C] bg-[#10231E]">
          <div className="space-y-1.5 p-6">
            <div className="h-6 w-1/2 rounded-md bg-[#16342D]" />
            <div className="h-4 w-3/4 rounded-md bg-[#16342D]" />
          </div>
          <div className="p-6 pt-0">
            <div className="overflow-hidden">
              <div className="w-full text-sm">
                <div className="[&_tr:last-child]:border-0">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b border-[#29443C] py-4"
                    >
                      <div className="space-y-2">
                        <div className="h-4 w-20 rounded-md bg-[#16342D]" />
                        <div className="h-3 w-24 rounded-md bg-[#16342D]" />
                      </div>
                      <div className="h-4 w-16 rounded-md bg-[#16342D]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
