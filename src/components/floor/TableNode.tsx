import * as React from "react";
import type { TableShape, TableStatus } from "@prisma/client";
export type { TableStatus };
import { motion, PanInfo } from "framer-motion";
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

const statusStyles: Record<TableStatus, string> = {
  AVAILABLE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:text-emerald-300",
  RESERVED: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-400/30 dark:text-amber-300",
  OCCUPIED: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:border-rose-400/30 dark:text-rose-300",
  MAINTENANCE: "border-slate-500/40 bg-slate-500/10 text-slate-700 dark:border-slate-500/40 dark:text-slate-300",
  UNAVAILABLE: "border-border bg-muted text-muted-foreground",
};

const statusDotStyles: Record<TableStatus, string> = {
  AVAILABLE: "bg-emerald-500 dark:bg-emerald-400",
  RESERVED: "bg-amber-500 dark:bg-amber-400",
  OCCUPIED: "bg-rose-500 dark:bg-rose-400",
  MAINTENANCE: "bg-slate-500 dark:bg-slate-400",
  UNAVAILABLE: "bg-muted-foreground",
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
  const iconProps = { className: "h-4 w-4 text-primary opacity-80" };
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

  const baseStyle = cn(
    "relative flex flex-col items-center justify-center border transition-shadow duration-300 rounded-2xl backdrop-blur-sm shadow-[0_10px_30px_rgba(3,15,11,0.08)] hover:shadow-[0_16px_40px_rgba(3,15,11,0.15)] active:scale-95 dark:shadow-[0_10px_30px_rgba(3,15,11,0.45)] dark:hover:shadow-[0_16px_40px_rgba(3,15,11,0.55)]",
    isEditing ? "cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-primary/50 touch-none" : "cursor-pointer"
  );
  
  const selectedStyle = selected
    ? "ring-[3px] ring-primary/70 shadow-[0_0_0_6px_rgba(123,166,153,0.08),0_18px_44px_rgba(123,166,153,0.25)]"
    : "";

  const invalidStyle = isInvalid
    ? "ring-[3px] ring-rose-500 shadow-[0_0_0_6px_rgba(244,63,94,0.15)] border-rose-500 bg-rose-500/5"
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
        statusStyles[table.status],
        selectedStyle,
        invalidStyle,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent" />

      <span
        className={cn(
          "absolute -top-2 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full shadow-sm ring-2 ring-background dark:shadow-[0_0_8px_rgba(0,0,0,0.4)]",
          statusDotStyles[table.status],
          table.status === "OCCUPIED" && "animate-pulse",
        )}
      />

      <div className="relative flex flex-col items-center gap-1">
        <ShapeIcon shape={table.shape} />
        <span className="font-mono text-xl font-bold tracking-tight text-foreground">
          {table.number}
        </span>
      </div>

      <div className="relative mt-3 flex items-center gap-1 rounded-full border border-border/50 bg-background/50 px-3 py-1 text-xs font-medium text-foreground">
        <Users className="h-3 w-3 text-muted-foreground" />
        {table.capacity}
      </div>

      {isEditing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(table.id);
          }}
          className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600 transition-colors z-20"
          aria-label="Delete table"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </motion.div>
  );
}
