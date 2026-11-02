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
import { Clock } from "lucide-react";

const timeSince = (date: string | Date): string => {
  const orderDate = new Date(date);
  const seconds = Math.floor((Date.now() - orderDate.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
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
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
    nextStatus: "PREPARING",
    actionText: "Accept Order",
  },
  PREPARING: {
    badgeClass: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/25",
    nextStatus: "READY",
    actionText: "Mark as Ready",
  },
  READY: {
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
    nextStatus: "SERVED",
    actionText: "Mark Served",
  },
  SERVED: {
    badgeClass: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/25",
  },
};

interface OrderCardProps {
  order: KitchenOrder;
  onStatusChange: (orderId: string, status: KitchenOrderStatus) => void;
}

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const config = statusConfig[order.status] ?? statusConfig.PENDING;

  const handleActionClick = () => {
    if (config.nextStatus) {
      onStatusChange(order.id, config.nextStatus);
    }
  };

  return (
    <Card className="flex flex-col rounded-2xl border-border bg-card shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-sm">
      <CardHeader className="flex-row items-center justify-between p-4 pb-3">
        <CardTitle className="text-base font-bold text-foreground">
          Table {order.tableNumber}
        </CardTitle>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{timeSince(order.createdAt)}</span>
        </div>
      </CardHeader>

      <CardContent className="grow space-y-2 p-4 pt-1 pb-3">
        {order.items.map((item, index) => (
          <div
            key={`${item.menuItemName}-${index}`}
            className="flex items-center justify-between text-sm py-1 border-b border-border/40 last:border-b-0"
          >
            <p className="font-medium text-foreground">{item.menuItemName}</p>
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
              ×{item.quantity}
            </span>
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex items-center justify-between rounded-b-2xl border-t border-border bg-muted/30 p-3.5">
        <div className="flex flex-col">
          <Badge variant="outline" className={cn("text-[11px] font-semibold w-fit", config.badgeClass)}>
            {order.status}
          </Badge>
          <p className="mt-1 text-sm font-bold text-foreground">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(order.totalAmount)}
          </p>
        </div>
        {config.actionText && (
          <Button
            size="sm"
            onClick={handleActionClick}
            className="rounded-xl bg-[#216E46] text-white hover:bg-[#1b5838] dark:bg-[#74A96B] dark:text-[#101712] text-xs font-semibold h-8 shadow-xs transition-transform active:scale-95"
          >
            {config.actionText}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
