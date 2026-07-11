import * as React from "react";
import type { TableShape, TableStatus } from "@prisma/client";
export type { TableStatus };
import { Users, Sofa, Beer, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Represents the data structure for a table node.
 * This should align with your Prisma model for `Table`.
 */
export interface TableNodeData {
  id: string;
  number: string;
  capacity: number;
  shape: TableShape;
  status: TableStatus;
  xPosition: number;
  yPosition: number;
  rotation: number;
  isActive: boolean;
}

interface TableNodeProps {
  table: TableNodeData;
  selected: boolean;
  onClick: (table: TableNodeData) => void;
}

const statusStyles: Record<TableStatus, string> = {
  AVAILABLE: "border-green-500/50 bg-green-500/10 text-green-400",
  RESERVED: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
  OCCUPIED: "border-red-500/50 bg-red-500/10 text-red-400",
  MAINTENANCE: "border-purple-500/50 bg-purple-500/10 text-purple-400",
  UNAVAILABLE: "border-slate-600/50 bg-slate-800/20 text-slate-500",
};

const statusDotStyles: Record<TableStatus, string> = {
  AVAILABLE: "bg-green-500",
  RESERVED: "bg-yellow-500",
  OCCUPIED: "bg-red-500",
  MAINTENANCE: "bg-purple-500",
  UNAVAILABLE: "bg-slate-600",
};

const shapeStyles: Record<TableShape, string> = {
  ROUND: "rounded-full aspect-square w-24",
  SQUARE: "rounded-lg aspect-square w-24",
  RECTANGLE: "rounded-lg w-32 h-20",
  SOFA: "rounded-lg w-36 h-20",
  BAR: "rounded-lg w-40 h-16",
  OUTDOOR: "rounded-full aspect-square w-24",
};

const ShapeIcon = ({ shape }: { shape: TableShape }) => {
  const iconProps = { className: "w-5 h-5" };
  switch (shape) {
    case "SOFA":
      return <Sofa {...iconProps} />;
    case "BAR":
      return <Beer {...iconProps} />;
    case "OUTDOOR":
      return <Sun {...iconProps} />;
    default:
      return null;
  }
};

export function TableNode({ table, selected, onClick }: TableNodeProps) {
  const baseStyle =
    "relative flex flex-col items-center justify-center p-2 border-2 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-cyan-500/20 hover:scale-105";
  const selectedStyle = selected
    ? "ring-2 ring-offset-2 ring-cyan-400 ring-offset-slate-900 scale-105"
    : "ring-0";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(table)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(table);
      }}
      className={cn(
        baseStyle,
        shapeStyles[table.shape],
        statusStyles[table.status],
        selectedStyle,
      )}
    >
      <span
        className={cn(
          "absolute top-2 right-2 h-3 w-3 rounded-full",
          statusDotStyles[table.status],
        )}
      />
      <div className="flex items-center gap-2">
        <ShapeIcon shape={table.shape} />
        <span className="text-2xl font-bold text-slate-100">
          {table.number}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-1.5 text-sm">
        <Users className="h-4 w-4" />
        <span>{table.capacity}</span>
      </div>
    </div>
  );
}
