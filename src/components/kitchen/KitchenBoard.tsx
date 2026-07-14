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
    color: "bg-yellow-500",
  },
  {
    title: "Preparing",
    status: "preparing" as const,
    color: "bg-blue-500",
  },
  {
    title: "Ready",
    status: "ready" as const,
    color: "bg-green-500",
  },
  {
    title: "Served",
    status: "served" as const,
    color: "bg-gray-500",
  },
];

export function KitchenBoard({ board, onStatusChange }: KitchenBoardProps) {
  return (
    <div className="h-full min-h-0 overflow-x-auto">
      <div className="grid h-full min-w-[1280px] grid-cols-4 gap-4">
        {columnConfig.map((col) => (
          <KitchenColumn
            key={col.status}
            title={col.title}
            color={col.color}
            orders={board[col.status]}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
