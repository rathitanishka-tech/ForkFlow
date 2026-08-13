import * as React from "react";
import { Clock, CheckCircle, ChefHat, BellRing, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "SERVED";

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  menuItemImage: string | null;
  quantity: number;
  price: number;
}

export interface CustomerOrder {
  id: string;
  tableNumber: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string | Date;
  estimatedCompletionTime?: string | Date;
  items?: OrderItem[];
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
    badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
    progress: 25,
  },
  PREPARING: {
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    progress: 50,
  },
  READY: {
    badgeClass: "bg-green-100 text-green-800 border-green-200",
    progress: 75,
  },
  SERVED: {
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
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
          ? "border-[#0f5b4c] bg-[#0f5b4c]/10 text-[#0f5b4c]"
          : "border-slate-300 bg-slate-100 text-slate-400",
      )}
    >
      <Icon className="h-5 w-5" />
    </div>
    <p
      className={cn(
        "mt-2 text-center text-xs font-medium",
        isCompleted ? "text-slate-700" : "text-slate-400",
      )}
    >
      {label}
    </p>
    {!isLast && (
      <div
        className={cn(
          "absolute left-1/2 top-5 h-0.5 w-full",
          isCompleted ? "bg-[#0f5b4c]" : "bg-slate-200",
        )}
      />
    )}
  </div>
);

const OrderItemsSection = ({ items }: { items: OrderItem[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="border-t border-slate-200 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-600">Order Items</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            {item.menuItemImage ? (
              <img
                src={item.menuItemImage}
                alt={item.menuItemName}
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                <Utensils className="h-5 w-5 text-slate-500" />
              </div>
            )}
            <div className="grow">
              <p className="font-medium text-slate-800">{item.menuItemName}</p>
              <p className="text-sm text-slate-500">
                ₹{item.price} × {item.quantity}
              </p>
            </div>
            <p className="font-medium text-slate-800">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export function OrderStatusCard({ order, loading }: OrderStatusCardProps) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex justify-between">
          <div className="h-5 w-2/5 rounded-md bg-slate-200" />
          <div className="h-5 w-1/4 rounded-md bg-slate-200" />
        </div>
        <div className="mb-6 flex justify-between">
          <div className="h-8 w-1/3 rounded-md bg-slate-200" />
          <div className="h-5 w-1/5 rounded-md bg-slate-200" />
        </div>
        <div className="mb-6 h-2 w-full rounded-full bg-slate-200" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div className="mt-2 h-3 w-12 rounded-md bg-slate-200" />
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
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
        <p className="text-sm text-slate-500">For Table {order.tableNumber}</p>

        <div className="my-4 flex items-end justify-between">
          <p className="text-2xl font-extrabold text-slate-900">
            {formatCurrency(order.totalAmount)}
          </p>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            <span>{timeSince(order.createdAt)}</span>
          </div>
        </div>

        <div className="mb-6 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-[#0f5b4c] transition-all duration-500"
            style={{ width: `${config.progress}%` }}
          />
        </div>

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

      {order.items && order.items.length > 0 && (
        <OrderItemsSection items={order.items} />
      )}

      {order.status === "SERVED" ? (
        <div className="border-t border-slate-200 bg-slate-50 p-4 text-center">
          <p className="mb-2 text-sm text-slate-600">Rate your experience</p>
          <div className="flex cursor-pointer justify-center gap-1 text-2xl text-slate-600 transition-colors hover:text-yellow-400">
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>
        </div>
      ) : order.status === "READY" ? (
        <div className="border-t border-slate-200 bg-green-50 p-4 text-center">
          <p className="animate-pulse text-lg font-bold text-green-700">
            🎉 Your food is ready!
          </p>
        </div>
      ) : order.estimatedCompletionTime ? (
        <div className="border-t border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-600">
            Estimated completion by{" "}
            <span className="font-semibold text-slate-800">
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
