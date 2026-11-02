import * as React from "react";
import {
  KitchenOrder,
  KitchenOrderStatus,
} from "@/modules/kitchen/kitchen.types";
import { OrderCard } from "./OrderCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KitchenColumnProps {
  title: string;
  dotColor: string;
  badgeClass: string;
  orders: KitchenOrder[];
  onStatusChange: (orderId: string, status: KitchenOrderStatus) => void;
}

export function KitchenColumn({
  title,
  dotColor,
  badgeClass,
  orders,
  onStatusChange,
}: KitchenColumnProps) {
  return (
    <div className="flex h-full min-h-[400px] w-full flex-col rounded-2xl border border-border bg-card p-4 shadow-xs">
      <div className="mb-4 flex items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", dotColor)} />
          <h2 className="text-sm font-bold text-foreground">{title}</h2>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "select-none px-2 py-0.5 text-xs font-bold rounded-full",
            badgeClass,
          )}
        >
          {orders.length}
        </Badge>
      </div>
      <div className="flex-1 space-y-3.5 overflow-y-auto pr-1">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <div className="flex h-48 flex-col items-center justify-center text-center text-muted-foreground">
            <span className="text-2xl opacity-60">✓</span>
            <p className="mt-2 text-xs font-semibold text-foreground">
              No {title.toLowerCase()} orders
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Station is clear</p>
          </div>
        )}
      </div>
    </div>
  );
}
