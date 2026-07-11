import * as React from "react";
import { TableNode, TableNodeData } from "./TableNode";

interface FloorCanvasProps {
  tables: TableNodeData[];
  selectedTableId?: string | null;
  onSelectTable: (table: TableNodeData) => void;
}

export function FloorCanvas({
  tables,
  selectedTableId,
  onSelectTable,
}: FloorCanvasProps) {
  return (
    <div className="relative h-full w-full overflow-auto rounded-lg bg-slate-950">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(51,65,85,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(51,65,85,0.5)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative h-full w-full">
        {tables.map((table) => (
          <div
            key={table.id}
            className="absolute transition-transform duration-300 ease-in-out"
            style={{
              left: `${table.xPosition * 10}px`,
              top: `${table.yPosition * 10}px`,
              transform: `rotate(${table.rotation || 0}deg)`,
            }}
          >
            <TableNode
              table={table}
              selected={table.id === selectedTableId}
              onClick={onSelectTable}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
