import * as React from "react";
import { CheckCircle, ChefHat, BellRing, Utensils, Star } from "lucide-react";
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

const statusTimeline: {
  status: OrderStatus;
  label: string;
  icon: React.ElementType;
}[] = [
  { status: "PENDING", label: "Received", icon: CheckCircle },
  { status: "PREPARING", label: "Preparing", icon: ChefHat },
  { status: "READY", label: "Ready", icon: BellRing },
  { status: "SERVED", label: "Served", icon: Utensils },
];

const TimelineItem = ({
  icon: Icon,
  label,
  isCompleted,
  isCurrent,
  isLast,
}: {
  icon: React.ElementType;
  label: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isLast: boolean;
}) => (
  <div className="relative flex flex-col items-center flex-1">
    <div
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300",
        isCurrent
          ? "border-primary bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20 scale-110"
          : isCompleted
            ? "border-[#216E46] bg-[#216E46] text-white dark:border-[#74A96B] dark:bg-[#74A96B] dark:text-[#101712]"
            : "border-border bg-muted/60 text-muted-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
    </div>
    <p
      className={cn(
        "mt-2 text-center text-xs font-semibold tracking-tight",
        isCurrent
          ? "text-primary font-bold"
          : isCompleted
            ? "text-foreground font-medium"
            : "text-muted-foreground",
      )}
    >
      {label}
    </p>
    {!isLast && (
      <div
        className={cn(
          "absolute left-1/2 top-4.5 -z-10 h-0.5 w-full -translate-y-1/2",
          isCompleted ? "bg-[#216E46] dark:bg-[#74A96B]" : "bg-border",
        )}
      />
    )}
  </div>
);

const OrderItemsSection = ({ items }: { items: OrderItem[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="border-t border-b border-border/80 py-5 my-6">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Ordered Items
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            {item.menuItemImage ? (
              <img
                src={item.menuItemImage}
                alt={item.menuItemName}
                className="h-10 w-10 shrink-0 rounded-lg border border-border object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                <Utensils className="h-4 w-4" />
              </div>
            )}
            <div className="grow min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">
                {item.menuItemName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(item.price)} × {item.quantity}
              </p>
            </div>
            <p className="text-sm font-bold text-foreground">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export function OrderStatusCard({ order, loading }: OrderStatusCardProps) {
  const [rating, setRating] = React.useState<number>(0);

  if (loading) {
    return (
      <div className="w-full animate-pulse rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
        <div className="mb-4 flex justify-between">
          <div className="h-4 w-28 rounded bg-muted" />
          <div className="h-4 w-20 rounded bg-muted" />
        </div>
        <div className="mb-6 flex justify-between">
          <div className="h-8 w-44 rounded bg-muted" />
          <div className="h-6 w-24 rounded bg-muted" />
        </div>
        <div className="mb-6 h-px w-full bg-border" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-9 w-9 rounded-full bg-muted" />
              <div className="mt-2 h-3 w-12 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusTimeline.findIndex(
    (s) => s.status === order.status,
  );

  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="p-6 sm:p-8">
        {/* Table & Order Identity */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-semibold mb-2">
            Table {order.tableNumber}
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Order #{order.id.substring(0, 6).toUpperCase()}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Placed at {new Date(order.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Stepper Timeline */}
        <div className="flex items-center justify-between mb-8 relative z-10 px-2 sm:px-4">
          {statusTimeline.map((item, index) => (
            <TimelineItem
              key={item.status}
              icon={item.icon}
              label={item.label}
              isCompleted={index < currentStatusIndex}
              isCurrent={index === currentStatusIndex}
              isLast={index === statusTimeline.length - 1}
            />
          ))}
        </div>

        {/* Items List */}
        {order.items && order.items.length > 0 && (
          <OrderItemsSection items={order.items} />
        )}

        {/* Total */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Settled
          </span>
          <p className="text-xl font-bold text-foreground">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>
      </div>

      {/* Footer Feedback / Status banners */}
      {order.status === "SERVED" ? (
        <div className="border-t border-border bg-muted/40 p-6 text-center">
          <p className="text-sm font-bold text-foreground mb-2">
            How was your dining experience?
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 cursor-pointer transition-transform hover:scale-110"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors",
                    star <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/40",
                  )}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Thank you for dining with us!
            </p>
          )}
        </div>
      ) : order.status === "READY" ? (
        <div className="border-t border-border bg-[#E5483F]/10 p-4 text-center">
          <p className="text-sm font-bold text-[#E5483F] flex items-center justify-center gap-2">
            <BellRing className="h-4 w-4 animate-bounce" />
            Your order is ready! A server will bring it to your table shortly.
          </p>
        </div>
      ) : order.estimatedCompletionTime ? (
        <div className="border-t border-border bg-muted/40 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Estimated kitchen completion around{" "}
            <span className="font-bold text-foreground">
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
