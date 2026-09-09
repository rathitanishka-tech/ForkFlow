import * as React from "react";
import { TableNode, TableNodeData } from "./TableNode";

interface FloorCanvasProps {
  tables: TableNodeData[];
  selectedTableId?: string | null;
  onSelectTable: (table: TableNodeData) => void;
  isEditing?: boolean;
  onTableMove?: (tableId: string, x: number, y: number) => void;
  onDeleteTable?: (tableId: string) => void;
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

interface DragState {
  tableId: string;
  originalLeft: number;
  originalTop: number;
  pointerOffsetX: number;
  pointerOffsetY: number;
  currentLeft: number;
  currentTop: number;
  isValid: boolean;
}

export function FloorCanvas({
  tables,
  selectedTableId,
  isEditing,
  onSelectTable,
  onTableMove,
  onDeleteTable,
}: FloorCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = React.useState({ width: 0, height: 0 });
  const [dragState, setDragState] = React.useState<DragState | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const getTableSize = (shape: string) => {
    switch (shape) {
      case "ROUND": return { width: 112, height: 112 };
      case "SQUARE": return { width: 112, height: 112 };
      case "RECTANGLE": return { width: 144, height: 80 };
      case "SOFA": return { width: 160, height: 80 };
      case "BAR": return { width: 176, height: 64 };
      case "OUTDOOR": return { width: 96, height: 96 };
      default: return { width: 112, height: 112 };
    }
  };

  const getTableGeometry = React.useCallback((
    table: TableNodeData, 
    canvasWidth: number, 
    canvasHeight: number,
    overrideLeft?: number,
    overrideTop?: number
  ) => {
    const size = getTableSize(table.shape);
    const safeWidth = Math.max(0, canvasWidth - size.width);
    const safeHeight = Math.max(0, canvasHeight - size.height);
    
    const left = overrideLeft !== undefined ? overrideLeft : (table.xPosition / 100) * safeWidth;
    const top = overrideTop !== undefined ? overrideTop : (table.yPosition / 100) * safeHeight;
    
    return {
      left,
      top,
      width: size.width,
      height: size.height,
      right: left + size.width,
      bottom: top + size.height,
    };
  }, []);

  const checkCollision = React.useCallback((
    proposedGeom: ReturnType<typeof getTableGeometry>,
    currentTableId: string,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    for (const table of tables) {
      if (table.id === currentTableId) continue;
      const otherGeom = getTableGeometry(table, canvasWidth, canvasHeight);
      
      const GAP = 8;
      if (
        proposedGeom.left < otherGeom.right + GAP &&
        proposedGeom.right + GAP > otherGeom.left &&
        proposedGeom.top < otherGeom.bottom + GAP &&
        proposedGeom.bottom + GAP > otherGeom.top
      ) {
        return { collided: true };
      }
    }
    return { collided: false };
  }, [tables, getTableGeometry]);

  const handlePointerDown = (tableId: string, e: React.PointerEvent<HTMLDivElement>) => {
    if (!isEditing || !containerRef.current) return;
    
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    // Use setPointerCapture to ensure we receive move/up events even if cursor leaves
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();

    const canvasRect = containerRef.current.getBoundingClientRect();
    const geom = getTableGeometry(table, containerSize.width, containerSize.height);

    const pointerX = e.clientX - canvasRect.left;
    const pointerY = e.clientY - canvasRect.top;

    setDragState({
      tableId,
      originalLeft: geom.left,
      originalTop: geom.top,
      pointerOffsetX: pointerX - geom.left,
      pointerOffsetY: pointerY - geom.top,
      currentLeft: geom.left,
      currentTop: geom.top,
      isValid: true,
    });
  };

  const handlePointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState || !containerRef.current) return;

    const canvasRect = containerRef.current.getBoundingClientRect();
    const table = tables.find(t => t.id === dragState.tableId);
    if (!table) return;

    const size = getTableSize(table.shape);
    const pointerX = e.clientX - canvasRect.left;
    const pointerY = e.clientY - canvasRect.top;

    let newLeft = pointerX - dragState.pointerOffsetX;
    let newTop = pointerY - dragState.pointerOffsetY;

    // Clamp entirely inside the canvas
    newLeft = Math.max(0, Math.min(newLeft, containerSize.width - size.width));
    newTop = Math.max(0, Math.min(newTop, containerSize.height - size.height));

    const proposedGeom = getTableGeometry(table, containerSize.width, containerSize.height, newLeft, newTop);
    const collision = checkCollision(proposedGeom, table.id, containerSize.width, containerSize.height);

    setDragState(prev => prev ? {
      ...prev,
      currentLeft: newLeft,
      currentTop: newTop,
      isValid: !collision.collided,
    } : null);
  }, [dragState, tables, containerSize, getTableGeometry, checkCollision]);

  const handlePointerUp = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState || !containerRef.current) return;
    
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (dragState.isValid && onTableMove) {
      const table = tables.find(t => t.id === dragState.tableId);
      if (table) {
        const size = getTableSize(table.shape);
        const safeWidth = Math.max(0, containerSize.width - size.width);
        const safeHeight = Math.max(0, containerSize.height - size.height);
        
        const newX = safeWidth > 0 ? (dragState.currentLeft / safeWidth) * 100 : 50;
        const newY = safeHeight > 0 ? (dragState.currentTop / safeHeight) * 100 : 50;
        
        onTableMove(dragState.tableId, newX, newY);
      }
    }

    setDragState(null);
  }, [dragState, tables, containerSize, onTableMove]);

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
        ref={containerRef}
        className="relative"
        style={{
          width: "100%",
          height: "700px",
          touchAction: "none",
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
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

        {tables.map((table) => {
          const isDragging = dragState?.tableId === table.id;
          const geom = getTableGeometry(table, containerSize.width, containerSize.height);
          
          const renderedLeft = isDragging ? dragState.currentLeft : geom.left;
          const renderedTop = isDragging ? dragState.currentTop : geom.top;

          return (
            <TableNode
              key={table.id}
              table={table}
              selected={table.id === selectedTableId}
              onClick={onSelectTable}
              isEditing={isEditing}
              onDelete={onDeleteTable}
              isInvalid={isDragging && !dragState.isValid}
              onPointerDown={handlePointerDown}
              style={{
                position: "absolute",
                left: `${renderedLeft}px`,
                top: `${renderedTop}px`,
                zIndex: isDragging || table.id === selectedTableId ? 50 : 10,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
