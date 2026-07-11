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
  color: string;
  orders: KitchenOrder[];
  onStatusChange: (orderId: string, status: KitchenOrderStatus) => void;
}

export function KitchenColumn({
  title,
  color,
  orders,
  onStatusChange,
}: KitchenColumnProps) {
  return (
    <div className="flex h-full w-full flex-col rounded-2xl bg-slate-950/40 p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn("h-3 w-3 rounded-full", color)} />
          <h2 className="text-lg font-semibold text-slate-200">{title}</h2>
        </div>
        <Badge
          className={cn(
            "select-none border-transparent text-sm font-bold",
            color,
          )}
        >
          {orders.length}
        </Badge>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
            <span className="text-4xl">🍽️</span>
            <p className="mt-4 font-semibold text-slate-400">
              No {title.toLowerCase()} orders
            </p>
            <p className="mt-1 text-sm">Kitchen is caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
