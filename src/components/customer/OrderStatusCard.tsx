import * as React from "react";
import { Clock, CheckCircle, ChefHat, BellRing, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "SERVED";

export interface CustomerOrder {
  id: string;
  tableNumber: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string | Date;
  estimatedCompletionTime?: string | Date;
}

interface OrderStatusCardProps {
  order: CustomerOrder;
  loading?: boolean;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const timeSince = (date: string | Date): string => {
  const orderDate = new Date(date);
  const seconds = Math.floor(
    (new Date().getTime() - orderDate.getTime()) / 1000,
  );
  if (seconds < 60) return `${Math.floor(seconds)} sec ago`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)} min ago`;
  const hours = minutes / 60;
  return `${Math.floor(hours)} hr ago`;
};

const statusTimeline: {
  status: OrderStatus;
  label: string;
  icon: React.ElementType;
}[] = [
  { status: "PENDING", label: "Order Placed", icon: CheckCircle },
  { status: "PREPARING", label: "Preparing", icon: ChefHat },
  { status: "READY", label: "Ready", icon: BellRing },
  { status: "SERVED", label: "Served", icon: Utensils },
];

const statusConfig: Record<
  OrderStatus,
  { badgeClass: string; progress: number }
> = {
  PENDING: {
    badgeClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    progress: 12.5,
  },
  PREPARING: {
    badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    progress: 37.5,
  },
  READY: {
    badgeClass: "bg-green-500/20 text-green-300 border-green-500/30",
    progress: 62.5,
  },
  SERVED: {
    badgeClass: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    progress: 100,
  },
};

const TimelineItem = ({
  icon: Icon,
  label,
  isCompleted,
  isLast,
}: {
  icon: React.ElementType;
  label: string;
  isCompleted: boolean;
  isLast: boolean;
}) => (
  <div className="relative flex flex-col items-center">
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border-2",
        isCompleted
          ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
          : "border-slate-700 bg-slate-800 text-slate-500",
      )}
    >
      <Icon className="h-5 w-5" />
    </div>
    <p
      className={cn(
        "mt-2 text-center text-xs font-medium",
        isCompleted ? "text-slate-200" : "text-slate-500",
      )}
    >
      {label}
    </p>
    {!isLast && (
      <div
        className={cn(
          "absolute left-1/2 top-5 h-0.5 w-full",
          isCompleted ? "bg-cyan-500" : "bg-slate-700",
        )}
      />
    )}
  </div>
);

export function OrderStatusCard({ order, loading }: OrderStatusCardProps) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 flex justify-between">
          <div className="h-5 w-2/5 rounded-md bg-slate-700" />
          <div className="h-5 w-1/4 rounded-md bg-slate-700" />
        </div>
        <div className="mb-6 flex justify-between">
          <div className="h-8 w-1/3 rounded-md bg-slate-700" />
          <div className="h-5 w-1/5 rounded-md bg-slate-700" />
        </div>
        <div className="mb-6 h-4 w-full rounded-full bg-slate-700" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-slate-700" />
              <div className="mt-2 h-3 w-12 rounded-md bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusTimeline.findIndex(
    (s) => s.status === order.status,
  );
  const config = statusConfig[order.status];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-white sm:text-xl">
            Order #{order.id.substring(0, 6).toUpperCase()}
          </h2>
          <div
            className={cn(
              "select-none rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider",
              config.badgeClass,
            )}
          >
            {order.status}
          </div>
        </div>
        <p className="text-sm text-slate-400">For Table {order.tableNumber}</p>

        {/* Details */}
        <div className="my-4 flex items-end justify-between">
          <p className="text-2xl font-extrabold text-white">
            {formatCurrency(order.totalAmount)}
          </p>
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <Clock className="h-4 w-4" />
            <span>{timeSince(order.createdAt)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 w-full rounded-full bg-slate-700">
          <div
            className="h-2 rounded-full bg-cyan-500 transition-all duration-500"
            style={{ width: `${config.progress}%` }}
          />
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-4">
          {statusTimeline.map((item, index) => (
            <TimelineItem
              key={item.status}
              icon={item.icon}
              label={item.label}
              isCompleted={index <= currentStatusIndex}
              isLast={index === statusTimeline.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Footer Section */}
      {order.status === "SERVED" ? (
        <div className="border-t border-slate-800 bg-slate-950/50 p-4 text-center">
          <p className="mb-2 text-sm text-slate-300">Rate your experience</p>
          <div className="flex cursor-pointer justify-center gap-1 text-2xl text-slate-600 transition-colors hover:text-yellow-400">
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>
        </div>
      ) : order.status === "READY" ? (
        <div className="border-t border-slate-800 bg-green-900/30 p-4 text-center">
          <p className="animate-pulse text-lg font-bold text-green-300">
            🎉 Your food is ready!
          </p>
        </div>
      ) : order.estimatedCompletionTime ? (
        <div className="border-t border-slate-800 bg-slate-950/50 p-4 text-center">
          <p className="text-sm text-slate-300">
            Estimated completion by{" "}
            <span className="font-semibold text-white">
              {new Date(order.estimatedCompletionTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
        </div>
      ) : null}
    </div>
  );
}
