import * as React from "react";
import {
  KitchenOrder,
  KitchenOrderStatus,
} from "@/modules/kitchen/kitchen.types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * A simple utility to format time since a date.
 * In a real app, use a library like `date-fns`.
 */
const timeSince = (date: string | Date): string => {
  const orderDate = new Date(date);

  const seconds = Math.floor((Date.now() - orderDate.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " min ago";

  return Math.floor(seconds) + " sec ago";
};

const statusConfig: Record<
  KitchenOrderStatus,
  {
    badgeClass: string;
    nextStatus?: KitchenOrderStatus;
    actionText?: string;
  }
> = {
  PENDING: {
    badgeClass: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    nextStatus: "PREPARING",
    actionText: "Accept",
  },
  PREPARING: {
    badgeClass: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    nextStatus: "READY",
    actionText: "Ready",
  },
  READY: {
    badgeClass: "bg-green-500/20 text-green-400 border-green-500/30",
    nextStatus: "SERVED",
    actionText: "Served",
  },
  SERVED: {
    badgeClass: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  },
};

interface OrderCardProps {
  order: KitchenOrder;
  onStatusChange: (orderId: string, status: KitchenOrderStatus) => void;
}

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const config = statusConfig[order.status];

  const handleActionClick = () => {
    if (config.nextStatus) {
      onStatusChange(order.id, config.nextStatus);
    }
  };

  return (
    <Card className="flex h-full flex-col rounded-2xl border-slate-800 bg-slate-900/80 text-slate-100 shadow-lg transition-all hover:shadow-cyan-500/10 hover:ring-1 hover:ring-slate-700">
      <CardHeader className="flex-row items-center justify-between p-4">
        <CardTitle className="text-xl font-bold">
          Table {order.tableNumber}
        </CardTitle>
        <span className="text-xs text-slate-400">
          {timeSince(order.createdAt)}
        </span>
      </CardHeader>

      <CardContent className="grow space-y-3 p-4 pt-0">
        {order.items.map((item, index) => (
          <div
            key={`${item.menuItemName}-${index}`}
            className="flex items-center justify-between"
          >
            <p className="font-medium text-slate-300">{item.menuItemName}</p>
            <p className="text-sm font-semibold text-slate-400">
              x{item.quantity}
            </p>
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex items-center justify-between rounded-b-2xl bg-slate-950/50 p-4">
        <div className="flex flex-col">
          <Badge className={cn("select-none", config.badgeClass)}>
            {order.status}
          </Badge>
          <p className="mt-1 text-lg font-bold text-white">
            ₹{order.totalAmount.toFixed(2)}
          </p>
        </div>
        {config.actionText && (
          <Button
            onClick={handleActionClick}
            className={cn(
              "bg-cyan-600 text-white hover:bg-cyan-500",
              "transition-transform active:scale-95",
            )}
          >
            {config.actionText}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
