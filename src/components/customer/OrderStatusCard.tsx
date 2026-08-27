import * as React from "react";
import { CheckCircle, ChefHat, BellRing, Utensils } from "lucide-react";
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
        "flex h-8 w-8 items-center justify-center rounded-none border border-[#E3DCD2]",
        isCompleted
          ? "bg-[#2A2421] text-[#FAF8F5] border-[#2A2421]"
          : "bg-transparent text-[#E3DCD2]",
      )}
    >
      <Icon className="h-4 w-4" />
    </div>
    <p
      className={cn(
        "mt-3 text-center font-sans text-[10px] font-semibold uppercase tracking-widest",
        isCompleted ? "text-[#2A2421]" : "text-[#5C544F]",
      )}
    >
      {label}
    </p>
    {!isLast && (
      <div
        className={cn(
          "absolute left-1/2 top-4 -z-10 h-px w-full",
          isCompleted ? "bg-[#2A2421]" : "bg-[#E3DCD2]",
        )}
      />
    )}
  </div>
);

const OrderItemsSection = ({ items }: { items: OrderItem[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="border-t border-b border-dashed border-[#E3DCD2] py-6 my-6">
      <h3 className="mb-4 text-center font-heading text-sm font-semibold tracking-widest text-[#5C544F] uppercase">
        Order Details
      </h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            {item.menuItemImage ? (
              <img
                src={item.menuItemImage}
                alt={item.menuItemName}
                className="h-10 w-10 shrink-0 border border-[#E3DCD2] object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#E3DCD2] bg-transparent">
                <Utensils className="h-4 w-4 text-[#E3DCD2]" />
              </div>
            )}
            <div className="grow">
              <p className="font-heading text-lg font-bold text-[#2A2421]">
                {item.menuItemName}
              </p>
              <p className="font-sans text-xs text-[#5C544F]">
                {formatCurrency(item.price)} × {item.quantity}
              </p>
            </div>
            <p className="font-sans text-sm font-semibold text-[#2A2421]">
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
      <div className="w-full animate-pulse border border-[#E3DCD2] bg-[#FAF8F5] p-6 shadow-sm sm:p-10">
        <div className="mb-4 flex justify-between">
          <div className="h-5 w-2/5 bg-[#E3DCD2]" />
          <div className="h-5 w-1/4 bg-[#E3DCD2]" />
        </div>
        <div className="mb-6 flex justify-between">
          <div className="h-8 w-1/3 bg-[#E3DCD2]" />
          <div className="h-5 w-1/5 bg-[#E3DCD2]" />
        </div>
        <div className="mb-6 h-px w-full bg-[#E3DCD2]" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-8 w-8 bg-[#E3DCD2]" />
              <div className="mt-2 h-2 w-12 bg-[#E3DCD2]" />
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
    <div className="w-full border border-[#E3DCD2] bg-[#FAF8F5] shadow-sm">
      <div className="p-6 sm:p-10">
        <div className="text-center mb-8">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#5C544F]">
            Table {order.tableNumber}
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-wider text-[#2A2421] sm:text-3xl">
            Order #{order.id.substring(0, 6).toUpperCase()}
          </h2>
          <p className="mt-2 font-sans text-xs text-[#5C544F]">
            Placed {new Date(order.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="grid grid-cols-4 mb-8 relative z-10">
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

        {order.items && order.items.length > 0 && (
          <OrderItemsSection items={order.items} />
        )}

        <div className="mt-6 flex items-end justify-between">
          <span className="font-heading text-lg font-bold tracking-widest text-[#5C544F] uppercase">
            Total
          </span>
          <p className="font-sans text-2xl font-bold text-[#2A2421]">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>
      </div>

      {order.status === "SERVED" ? (
        <div className="border-t border-[#E3DCD2] bg-[#F2EFE9] p-6 text-center">
          <p className="mb-3 font-heading text-lg font-semibold tracking-wide text-[#2A2421]">
            How was your experience?
          </p>
          <div className="flex cursor-pointer justify-center gap-2 text-2xl text-[#E3DCD2] transition-colors hover:text-[#8B2E2E]">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>
        </div>
      ) : order.status === "READY" ? (
        <div className="border-t border-[#E3DCD2] bg-[#F2EFE9] p-6 text-center">
          <p className="font-heading text-xl font-bold tracking-wide text-[#8B2E2E]">
            Your order is ready to be served.
          </p>
        </div>
      ) : order.estimatedCompletionTime ? (
        <div className="border-t border-[#E3DCD2] bg-[#F2EFE9] p-4 text-center">
          <p className="font-sans text-xs uppercase tracking-widest text-[#5C544F]">
            Estimated completion around{" "}
            <span className="font-bold text-[#2A2421]">
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
