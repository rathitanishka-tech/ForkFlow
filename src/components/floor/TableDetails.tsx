import * as React from "react";
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
  AVAILABLE: "bg-green-900/50 text-green-300 border-green-700",
  RESERVED: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
  OCCUPIED: "bg-red-900/50 text-red-300 border-red-700",
  MAINTENANCE: "bg-purple-900/50 text-purple-300 border-purple-700",
  UNAVAILABLE: "bg-slate-800/50 text-slate-400 border-slate-700",
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
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-slate-500" />
      <span className="text-sm font-medium text-slate-400">{label}</span>
    </div>
    <span className="font-mono text-sm font-semibold text-slate-200">
      {value}
    </span>
  </div>
);

export function TableDetails({ table }: TableDetailsProps) {
  if (!table) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950/50 p-6 text-center">
        <MousePointerSquareDashed className="h-10 w-10 text-slate-600" />
        <h3 className="mt-4 text-lg font-semibold text-slate-300">
          No Table Selected
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Click on a table in the floor plan to view its details.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-bold text-white">Table {table.number}</h2>
        <div
          className={cn(
            "select-none rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider",
            statusStyles[table.status],
          )}
        >
          {table.status}
        </div>
      </div>
      <div className="my-6 h-px w-full bg-slate-800" />
      <div className="space-y-5">
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
              <span className="text-lg leading-none">
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
    </div>
  );
}
