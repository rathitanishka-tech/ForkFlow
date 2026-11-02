import * as React from "react";
import type { TableShape, TableStatus } from "@prisma/client";
export type { TableStatus };
import { motion } from "framer-motion";
import { Users, Sofa, Beer, Sun, X } from "lucide-react";
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
  isEditing?: boolean;
  isInvalid?: boolean;
  onPointerDown?: (tableId: string, e: React.PointerEvent<HTMLDivElement>) => void;
  onDelete?: (id: string) => void;
  style?: React.CSSProperties;
}

const statusDotStyles: Record<TableStatus, string> = {
  AVAILABLE: "bg-emerald-400",
  RESERVED: "bg-amber-400",
  OCCUPIED: "bg-[#FF6258]",
  MAINTENANCE: "bg-slate-400",
  UNAVAILABLE: "bg-slate-400",
};

const shapeStyles: Record<TableShape, string> = {
  ROUND: "rounded-full aspect-square w-28",
  SQUARE: "rounded-2xl aspect-square w-28",
  RECTANGLE: "rounded-2xl w-36 h-20",
  SOFA: "rounded-2xl w-40 h-20",
  BAR: "rounded-2xl w-44 h-16",
  OUTDOOR: "rounded-full aspect-square w-24",
};

const ShapeIcon = ({ shape }: { shape: TableShape }) => {
  const iconProps = { className: "h-4 w-4 text-white/80" };
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

export function TableNode({
  table,
  selected,
  onClick,
  isEditing,
  isInvalid,
  onPointerDown,
  onDelete,
  style,
}: TableNodeProps) {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  // Light theme: basil green #226B4D with fresh green border #3B8A61
  // Dark theme: rich dark basil #24583F with brighter basil green border #4A9167
  const baseStyle = cn(
    "relative flex flex-col items-center justify-center border border-[#3B8A61] dark:border-[#4A9167] bg-[#226B4D] dark:bg-[#24583F] text-white transition-all duration-200 backdrop-blur-sm shadow-[0_8px_24px_rgba(34,107,77,0.18)] hover:shadow-[0_14px_32px_rgba(34,107,77,0.28)] active:scale-95 dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.55)]",
    isEditing ? "cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-[#3B8A61]/60 dark:hover:ring-[#4A9167]/60 touch-none" : "cursor-pointer"
  );
  
  // Selection: fresh green #3B8A61 (light) / brighter basil green #4A9167 (dark)
  const selectedStyle = selected
    ? "ring-[3px] ring-[#3B8A61] dark:ring-[#4A9167] shadow-[0_0_0_5px_rgba(59,138,97,0.25)] dark:shadow-[0_0_0_5px_rgba(74,145,103,0.35)]"
    : "";

  // Invalid placement during drag collision: Tomato red #FF6258
  const invalidStyle = isInvalid
    ? "ring-[3px] ring-[#FF6258] border-[#FF6258] bg-[#FF6258]/35 shadow-[0_0_0_6px_rgba(255,98,88,0.25)]"
    : "";

  return (
    <motion.div
      ref={nodeRef}
      style={style}
      layout
      initial={false}
      animate={{ opacity: 1, scale: 1, left: style?.left, top: style?.top }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      whileHover={
        isEditing
          ? { scale: 1.02 }
          : {
              scale: 1.06,
              y: -4,
            }
      }
      whileTap={{
        scale: 0.97,
      }}
      onPointerDown={(e) => {
        if (isEditing && onPointerDown) {
          onPointerDown(table.id, e);
        }
      }}
      role="button"
      tabIndex={0}
      onClick={() => {
        if (!isEditing) onClick(table);
      }}
      onKeyDown={(e) => {
        if (!isEditing && (e.key === "Enter" || e.key === " ")) onClick(table);
      }}
      className={cn(
        baseStyle,
        shapeStyles[table.shape],
        selectedStyle,
        invalidStyle,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent" />

      {/* Status Dot: green available, amber reserved, tomato red occupied, slate maintenance */}
      <span
        className={cn(
          "absolute -top-2 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full shadow-sm ring-2 ring-[#226B4D] dark:ring-[#24583F]",
          statusDotStyles[table.status],
          table.status === "OCCUPIED" && "animate-pulse",
        )}
      />

      {/* Clear white table label */}
      <div className="relative flex flex-col items-center gap-1">
        <ShapeIcon shape={table.shape} />
        <span className="font-mono text-xl font-bold tracking-tight text-white">
          {table.number}
        </span>
      </div>

      {/* High-contrast capacity badge */}
      <div className="relative mt-2.5 flex items-center gap-1 rounded-full border border-[#3B8A61]/60 dark:border-[#4A9167]/60 bg-[#1A573E]/80 dark:bg-[#1B4330]/80 px-2.5 py-0.5 text-xs font-semibold text-white shadow-xs">
        <Users className="h-3 w-3 text-white/80" />
        {table.capacity}
      </div>

      {/* Tomato red delete button during layout edit */}
      {isEditing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(table.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6258] text-white shadow-md hover:bg-[#E5483F] transition-colors z-20 cursor-pointer"
          aria-label="Delete table"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </motion.div>
  );
}
