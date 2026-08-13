import * as React from "react";
import type { TableShape, TableStatus } from "@prisma/client";
export type { TableStatus };
import { motion } from "framer-motion";
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
  AVAILABLE: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",

  RESERVED: "border-amber-400/30 bg-amber-500/10 text-amber-300",

  OCCUPIED: "border-rose-400/30 bg-rose-500/10 text-rose-300",

  MAINTENANCE: "border-slate-500/40 bg-slate-500/10 text-slate-300",

  UNAVAILABLE: "border-[#29443C] bg-[#081E19] text-[#6D8179]",
};

const statusDotStyles: Record<TableStatus, string> = {
  AVAILABLE: "bg-emerald-400",
  RESERVED: "bg-amber-400",
  OCCUPIED: "bg-rose-400",
  MAINTENANCE: "bg-slate-400",
  UNAVAILABLE: "bg-[#50635C]",
};

const shapeStyles: Record<TableShape, string> = {
  ROUND: "rounded-full aspect-square w-28",
  SQUARE: "rounded-lg aspect-square w-28",
  RECTANGLE: "rounded-lg w-36 h-20",
  SOFA: "rounded-lg w-40 h-20",
  BAR: "rounded-lg w-44 h-16",
  OUTDOOR: "rounded-full aspect-square w-24",
};

const ShapeIcon = ({ shape }: { shape: TableShape }) => {
  const iconProps = { className: "h-4 w-4 text-[#D6B48C]/80" };
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
    "relative flex flex-col items-center justify-center border cursor-pointer transition-shadow duration-300 rounded-2xl backdrop-blur-sm shadow-[0_10px_30px_rgba(3,15,11,0.45)] hover:shadow-[0_16px_40px_rgba(3,15,11,0.55)] active:scale-95";
  const selectedStyle = selected
    ? "ring-[3px] ring-[#D6B48C]/70 shadow-[0_0_0_6px_rgba(214,180,140,0.08),0_18px_44px_rgba(214,180,140,0.25)]"
    : "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      whileHover={{
        scale: 1.06,
        y: -4,
      }}
      whileTap={{
        scale: 0.97,
      }}
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
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent" />

      <span
        className={cn(
          "absolute -top-2 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.4)] ring-2 ring-[#0E221D]",
          statusDotStyles[table.status],
          table.status === "OCCUPIED" && "animate-pulse",
        )}
      />

      <div className="relative flex flex-col items-center gap-1">
        <ShapeIcon shape={table.shape} />
        <span className="font-mono text-xl font-bold tracking-tight text-[#F8F5EF]">
          {table.number}
        </span>
      </div>

      <div className="relative mt-3 flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-medium text-[#C5D5CF]">
        <Users className="h-3 w-3 text-[#8EA79D]" />
        {table.capacity}
      </div>
    </motion.div>
  );
}
