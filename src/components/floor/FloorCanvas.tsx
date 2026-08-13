import * as React from "react";
import { TableNode, TableNodeData } from "./TableNode";

interface FloorCanvasProps {
  tables: TableNodeData[];
  selectedTableId?: string | null;
  onSelectTable: (table: TableNodeData) => void;
}

function ZoneLabel({
  style,
  children,
}: {
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      className="pointer-events-none select-none whitespace-nowrap rounded-full border border-white/[0.06] bg-[#0C1F1A]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6D8179] shadow-[0_4px_16px_rgba(3,15,11,0.4)] backdrop-blur-sm"
      style={{ position: "absolute", zIndex: 20, ...style }}
    >
      {children}
    </div>
  );
}

export function FloorCanvas({
  tables,
  selectedTableId,
  onSelectTable,
}: FloorCanvasProps) {
  const columns = Math.max(1, Math.min(4, tables.length));
  const rows = Math.max(1, Math.ceil(tables.length / columns));

  const marginXStart = 16; // % — clears the Bar / Waiting Area labels
  const marginXEnd = 16; // % — clears the Kitchen / VIP labels
  const marginYStart = 26; // % — clears the Entrance label
  const marginYEnd = 24; // % — clears the Waiting Area / VIP labels and the Buffet counter

  const usableWidth = 100 - marginXStart - marginXEnd;
  const usableHeight = 100 - marginYStart - marginYEnd;
  const colGap = columns > 1 ? usableWidth / (columns - 1) : 0;
  const rowGap = rows > 1 ? usableHeight / (rows - 1) : 0;

  const gridTables = tables.map((table, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);

    const stagger = row % 2 === 1 && columns > 1 ? colGap / 2 : 0;

    const rawX = columns > 1 ? marginXStart + col * colGap + stagger : 50;
    let xPosition = Math.min(rawX, 100 - marginXEnd);
    let yPosition = rows > 1 ? marginYStart + row * rowGap : 50;

    if (table.number === "T7") {
      xPosition = 84;
      yPosition = Math.min(84, 100 - marginYEnd);
    }
    if (table.number === "T9") {
      xPosition = 54;
      yPosition = Math.min(84, 100 - marginYEnd);
    }

    return { ...table, xPosition, yPosition };
  });

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-[#29443C] bg-gradient-to-br from-[#10231E] via-[#143128] to-[#0E221D] shadow-[0_24px_70px_rgba(3,15,11,0.35)]"
      style={{ height: 700, overflow: "hidden" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(3,15,11,0.35)_100%)]" />

      <div className="absolute inset-6 rounded-3xl border border-[#35554A]" />
      <div className="pointer-events-none absolute inset-[30px] rounded-[1.4rem] border border-white/[0.03]" />

      <div
        className="relative"
        style={{
          width: "100%",
          height: "700px",
        }}
      >
        <ZoneLabel
          style={{ left: "50%", top: 36, transform: "translateX(-50%)" }}
        >
          Entrance
        </ZoneLabel>
        <ZoneLabel style={{ right: 56, top: 36 }}>Kitchen</ZoneLabel>
        <ZoneLabel style={{ left: 56, top: 36 }}>Bar</ZoneLabel>
        <ZoneLabel style={{ left: 56, bottom: 36 }}>Waiting Area</ZoneLabel>
        <ZoneLabel style={{ right: 56, bottom: 36 }}>VIP</ZoneLabel>

        <div
          className="pointer-events-none"
          style={{ position: "absolute", inset: 0 }}
        >
          <div
            className="h-px w-3/4 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
            style={{
              position: "absolute",
              left: "50%",
              top: "30%",
              transform: "translateX(-50%)",
            }}
          />
          <div
            className="h-px w-3/4 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
            style={{
              position: "absolute",
              left: "50%",
              bottom: "30%",
              transform: "translateX(-50%)",
            }}
          />
        </div>

        <div
          className="pointer-events-none"
          style={{
            position: "absolute",
            left: "50%",
            bottom: 32,
            transform: "translateX(-50%)",
            zIndex: 20,
          }}
        >
          <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-black/20 px-6 py-3 text-sm text-white/40 shadow-lg backdrop-blur-sm">
            <span>🍽</span>
            <span className="font-semibold uppercase tracking-[0.2em]">
              Buffet
            </span>
            <span>🍽</span>
          </div>
        </div>

        {gridTables.map((table) => (
          <div
            key={table.id}
            style={{
              position: "absolute",
              left: `calc(${table.xPosition}% - 30px)`,
              top: `calc(${table.yPosition}% - 20px)`,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
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
