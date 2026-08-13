import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TableNodeData, TableStatus } from "./TableNode";
import { cn } from "@/lib/utils";
import {
  Users,
  Shapes,
  Maximize,
  RotateCw,
  MousePointerSquareDashed,
} from "lucide-react";

const statusStyles: Record<TableStatus, string> = {
  AVAILABLE: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",

  RESERVED: "border-amber-400/20 bg-amber-500/10 text-amber-300",

  OCCUPIED: "border-rose-400/20 bg-rose-500/10 text-rose-300",

  MAINTENANCE: "border-slate-500/20 bg-slate-500/10 text-slate-300",

  UNAVAILABLE: "border-[#29443C] bg-[#081E19] text-[#6D8179]",
};

interface TableDetailsProps {
  table: TableNodeData | null;
}

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center justify-between rounded-xl border border-[#1D362F] bg-[#0C1F1A] px-4 py-3.5 transition-colors duration-200 hover:border-[#29443C]">
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#29443C] bg-[#10231E]">
        <Icon className="h-4 w-4 text-[#D6B48C]" />
      </span>
      <span className="text-sm font-medium text-[#8EA79D]">{label}</span>
    </div>
    <span className="font-mono text-sm font-semibold text-[#F8F5EF]">
      {value}
    </span>
  </div>
);

export function TableDetails({ table }: TableDetailsProps) {
  if (!table) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-[1.5rem] border border-[#29443C] bg-[#10231E] p-8 text-center shadow-[0_18px_50px_rgba(3,15,11,0.22)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#29443C] bg-[#0C1F1A]">
          <MousePointerSquareDashed className="h-7 w-7 text-[#D6B48C]" />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-[#F8F5EF]">
          No Table Selected
        </h3>
        <p className="mt-2 max-w-xs text-sm text-[#8EA79D]">
          Click on a table in the floor plan to view its details.
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={table.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex h-full flex-col rounded-[1.5rem] border border-[#29443C] bg-[#10231E] p-6 shadow-[0_18px_50px_rgba(3,15,11,0.22)]"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8EA79D]">
              Table
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-[#F8F5EF]">
              {table.number}
            </h2>
          </div>
          <div
            className={cn(
              "select-none rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider",
              statusStyles[table.status],
            )}
          >
            {table.status
              .replace("_", " ")
              .toLowerCase()
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </div>
        </div>

        <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-[#29443C] to-transparent" />

        <div className="space-y-3">
          <DetailRow
            icon={Users}
            label="Capacity"
            value={`${table.capacity} Guests`}
          />
          <DetailRow
            icon={Shapes}
            label="Shape"
            value={
              <span className="flex items-center gap-2 capitalize">
                <span className="text-lg leading-none text-[#D6B48C]">
                  {{
                    ROUND: "◯",
                    SQUARE: "□",
                    RECTANGLE: "▭",
                    SOFA: "🛋",
                    BAR: "─",
                    OUTDOOR: "◯",
                  }[table.shape] || "■"}
                </span>
                <span>{table.shape.toLowerCase().replace("_", " ")}</span>
              </span>
            }
          />
          <DetailRow
            icon={Maximize}
            label="Coordinates"
            value={`X: ${table.xPosition.toFixed(0)}, Y: ${table.yPosition.toFixed(
              0,
            )}`}
          />
          <DetailRow
            icon={RotateCw}
            label="Rotation"
            value={`${table.rotation.toFixed(0)}°`}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
