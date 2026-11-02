import * as React from "react";
import {
  KitchenBoard as KitchenBoardType,
  KitchenOrderStatus,
} from "@/modules/kitchen/kitchen.types";
import { KitchenColumn } from "./KitchenColumn";

interface KitchenBoardProps {
  board: KitchenBoardType;
  onStatusChange: (orderId: string, status: KitchenOrderStatus) => void;
}

const columnConfig = [
  {
    title: "Pending",
    status: "pending" as const,
    dotColor: "bg-amber-500",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
  },
  {
    title: "Preparing",
    status: "preparing" as const,
    dotColor: "bg-sky-500",
    badgeClass: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/25",
  },
  {
    title: "Ready",
    status: "ready" as const,
    dotColor: "bg-emerald-500",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  },
  {
    title: "Served",
    status: "served" as const,
    dotColor: "bg-slate-500",
    badgeClass: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/25",
  },
];

export function KitchenBoard({ board, onStatusChange }: KitchenBoardProps) {
  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <div className="flex flex-col gap-5 pb-6 lg:grid lg:h-full lg:grid-cols-4 lg:gap-4 lg:pb-0">
        {columnConfig.map((col) => (
          <KitchenColumn
            key={col.status}
            title={col.title}
            dotColor={col.dotColor}
            badgeClass={col.badgeClass}
            orders={board[col.status]}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
