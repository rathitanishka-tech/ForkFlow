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
    color: "bg-yellow-500 text-yellow-950",
  },
  {
    title: "Preparing",
    status: "preparing" as const,
    color: "bg-blue-500 text-white",
  },
  {
    title: "Ready",
    status: "ready" as const,
    color: "bg-green-500 text-white",
  },
  {
    title: "Served",
    status: "served" as const,
    color: "bg-gray-500 text-white",
  },
];

export function KitchenBoard({ board, onStatusChange }: KitchenBoardProps) {
  return (
    <div className="h-full min-h-0 overflow-y-auto lg:overflow-x-hidden">
      <div className="flex flex-col gap-6 pb-6 lg:grid lg:h-full lg:grid-cols-4 lg:gap-4 lg:pb-0">
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
