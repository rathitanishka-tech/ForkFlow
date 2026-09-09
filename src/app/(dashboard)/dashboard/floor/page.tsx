"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FloorCanvas } from "@/components/floor/FloorCanvas";
import { TableDetails } from "@/components/floor/TableDetails";
import { EditTablePanel } from "@/components/floor/EditTablePanel";
import { TableNodeData } from "@/components/floor/TableNode";
import { X, Map } from "lucide-react";

function LegendRow({
  color,
  label,
  count,
}: {
  color: string;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-secondary px-4 py-3 transition-colors duration-200 hover:border-border">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <span className="text-sm text-[#8EA79D]">{label}</span>
      </div>

      <span className="font-mono text-sm font-semibold text-[#F8F5EF]">
        {count}
      </span>
    </div>
  );
}

export default function FloorPlanPage() {
  const [floors, setFloors] = React.useState<any[]>([]);
  const [selectedFloorId, setSelectedFloorId] = React.useState<string>("");

  const [tables, setTables] = React.useState<TableNodeData[]>([]);
  const [selectedTable, setSelectedTable] =
    React.useState<TableNodeData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [isEditing, setIsEditing] = React.useState(false);
  const [draftTables, setDraftTables] = React.useState<TableNodeData[] | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const [isAddTableOpen, setIsAddTableOpen] = React.useState(false);
  const [isAddingTable, setIsAddingTable] = React.useState(false);

  const [tableToDelete, setTableToDelete] = React.useState<string | null>(null);
  const [isDeletingTable, setIsDeletingTable] = React.useState(false);

  React.useEffect(() => {
    const fetchFloors = async () => {
      try {
        const res = await fetch("/api/floors");
        if (!res.ok) throw new Error("Failed to fetch floors");
        const json = await res.json();
        const floorList = json.data || [];
        setFloors(floorList);
        if (floorList.length > 0) {
          setSelectedFloorId(floorList[0].id);
        } else {
          setIsLoading(false); // Stop loading if no floors
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    fetchFloors();
  }, []);

  React.useEffect(() => {
    if (isEditing || !selectedFloorId) return;

    const fetchTables = async () => {
      try {
        const response = await fetch(`/api/tables?floorId=${selectedFloorId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch tables.");
        }
        const result = await response.json();
        const activeTables = Array.isArray(result.data)
          ? (result.data as TableNodeData[]).filter((t) => t.isActive)
          : [];

        setTables(activeTables);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();

    const interval = setInterval(fetchTables, 5000);

    return () => clearInterval(interval);
  }, [isEditing, selectedFloorId]);

  const hasUnsavedChanges = React.useMemo(() => {
    if (!isEditing || !draftTables) return false;
    return draftTables.some((draft) => {
      const original = tables.find((t) => t.id === draft.id);
      if (!original) return false;
      return original.xPosition !== draft.xPosition || original.yPosition !== draft.yPosition;
    });
  }, [draftTables, tables, isEditing]);

  const handleEditLayout = () => {
    setIsEditing(true);
    setDraftTables([...tables]);
    setSelectedTable(null);
  };

  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm("You have unsaved layout changes. Discard them?")) {
        return;
      }
    }
    setIsEditing(false);
    setDraftTables(null);
  };

  const handleTableMove = (tableId: string, x: number, y: number) => {
    if (!draftTables) return;
    setDraftTables((prev) =>
      prev
        ? prev.map((t) =>
            t.id === tableId ? { ...t, xPosition: x, yPosition: y } : t
          )
        : null
    );
  };

  const handleTableChange = (updatedTable: TableNodeData) => {
    if (!draftTables) return;
    setDraftTables((prev) =>
      prev
        ? prev.map((t) => (t.id === updatedTable.id ? updatedTable : t))
        : null
    );
    if (selectedTable?.id === updatedTable.id) {
      setSelectedTable(updatedTable);
    }
  };

  const confirmDeleteTable = (tableId: string) => {
    setTableToDelete(tableId);
  };

  const handleDeleteTable = async () => {
    if (!tableToDelete) return;
    setIsDeletingTable(true);
    try {
      const res = await fetch(`/api/tables/${tableToDelete}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete table");
      }
      
      setTables((prev) => prev.filter((t) => t.id !== tableToDelete));
      if (draftTables) {
        setDraftTables((prev) => prev ? prev.filter((t) => t.id !== tableToDelete) : null);
      }
      if (selectedTable?.id === tableToDelete) setSelectedTable(null);
      setTableToDelete(null);
    } catch (err: any) {
      alert(err.message);
      setTableToDelete(null);
    } finally {
      setIsDeletingTable(false);
    }
  };

  const handleAddTable = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFloorId) return;
    setIsAddingTable(true);
    const formData = new FormData(e.currentTarget);
    const number = formData.get("number") as string;
    const capacity = parseInt(formData.get("capacity") as string, 10);
    const shape = formData.get("shape") as any;

    try {
      // --- Smart Position Search ---
      const getApproxSize = (s: string) => {
        switch (s) {
          case "ROUND": return { w: 11.2, h: 16 };
          case "SQUARE": return { w: 11.2, h: 16 };
          case "RECTANGLE": return { w: 14.4, h: 11.4 };
          case "SOFA": return { w: 16, h: 11.4 };
          case "BAR": return { w: 17.6, h: 9.1 };
          case "OUTDOOR": return { w: 9.6, h: 13.7 };
          default: return { w: 11.2, h: 16 };
        }
      };

      const hasCollision = (x: number, y: number, testShape: string, allTables: TableNodeData[]) => {
        const sz = getApproxSize(testShape);
        const l1 = x;
        const r1 = x + sz.w;
        const t1 = y;
        const b1 = y + sz.h;

        for (const t of allTables) {
          const tsz = getApproxSize(t.shape);
          const l2 = t.xPosition;
          const r2 = t.xPosition + tsz.w;
          const t2 = t.yPosition;
          const b2 = t.yPosition + tsz.h;

          if (l1 < r2 && r1 > l2 && t1 < b2 && b1 > t2) {
            return true;
          }
        }
        return false;
      };

      const gridPositions = [];
      for (let x = 0; x <= 100; x += 10) {
        for (let y = 0; y <= 100; y += 10) {
          gridPositions.push({ x, y });
        }
      }
      gridPositions.sort((a, b) => {
        const distA = Math.pow(a.x - 50, 2) + Math.pow(a.y - 50, 2);
        const distB = Math.pow(b.x - 50, 2) + Math.pow(b.y - 50, 2);
        return distA - distB;
      });

      const currentLayout = draftTables || tables;
      const validPos = gridPositions.find(pos => !hasCollision(pos.x, pos.y, shape, currentLayout));

      if (!validPos) {
        throw new Error("No available space for another table. Please rearrange or delete existing tables.");
      }

      // -----------------------------

      const res = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          floorId: selectedFloorId,
          number,
          capacity,
          shape,
          xPosition: validPos.x,
          yPosition: validPos.y,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create table");
      }

      const newTable = await res.json();
      
      setTables((prev) => [...prev, newTable]);
      if (draftTables) {
        setDraftTables((prev) => prev ? [...prev, newTable] : [newTable]);
      }
      setSelectedTable(newTable);
      setIsAddTableOpen(false);
    } catch (err: any) {
      // Don't alert, let's display it safely or let the user see it if we can.
      // For now, alert is okay, but later we will improve.
      alert(err.message);
    } finally {
      setIsAddingTable(false);
    }
  };

  const handleSaveLayout = async () => {
    if (!draftTables) return;
    setIsSaving(true);
    try {
      const changedTables = draftTables.filter((draftT) => {
        const originalT = tables.find((t) => t.id === draftT.id);
        return (
          originalT &&
          (originalT.xPosition !== draftT.xPosition ||
            originalT.yPosition !== draftT.yPosition ||
            originalT.number !== draftT.number ||
            originalT.capacity !== draftT.capacity ||
            originalT.shape !== draftT.shape ||
            originalT.isActive !== draftT.isActive)
        );
      });

      await Promise.all(
        changedTables.map((t) =>
          fetch(`/api/tables/${t.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              xPosition: t.xPosition,
              yPosition: t.yPosition,
              number: t.number,
              capacity: t.capacity,
              shape: t.shape,
              isActive: t.isActive,
            }),
          })
        )
      );

      setTables(draftTables);
      setIsEditing(false);
      setDraftTables(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save layout.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectTable = (table: TableNodeData) => {
    if (selectedTable?.id === table.id) {
      setSelectedTable(null);
    } else {
      setSelectedTable(table);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-[1.6rem] border border-border bg-card px-5 py-5 shadow-xl sm:flex-row sm:items-end sm:px-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground flex items-center gap-4">
            Floor Planner
            {floors.length > 0 && (
              <select 
                className="text-sm rounded-md border border-border bg-secondary px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/50"
                value={selectedFloorId}
                onChange={(e) => {
                  setSelectedFloorId(e.target.value);
                  setIsLoading(true);
                }}
                disabled={isEditing}
              >
                {floors.map(f => (
                  <option key={f.id} value={f.id}>{f.name} (Level {f.level})</option>
                ))}
              </select>
            )}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your restaurant&apos;s tables and layout in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              {hasUnsavedChanges && (
                <span className="text-sm text-amber-500 mr-2 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  Unsaved changes
                </span>
              )}
              <button
                onClick={() => setIsAddTableOpen(true)}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Add Table
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLayout}
                disabled={isSaving}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {isSaving ? "Saving..." : "Save Layout"}
              </button>
            </>
          ) : (
            <button
              onClick={handleEditLayout}
              disabled={!selectedFloorId}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit Layout
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="flex h-[600px] items-center justify-center rounded-[1.5rem] border border-border bg-card">
              <p className="text-muted-foreground">Loading floor plan...</p>
            </div>
          ) : error ? (
            <Card className="flex h-full items-center justify-center rounded-[1.5rem] border border-border bg-card">
              <div className="text-center">
                <X className="mx-auto mb-4 h-10 w-10 text-rose-400" />
                <h3 className="text-lg font-semibold text-foreground">
                  Failed to load floor plan
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{error}</p>
              </div>
            </Card>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="md:hidden mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                The floor planner is highly interactive and best viewed on a desktop or tablet device. You can scroll horizontally to view the canvas on mobile.
              </div>
              <div className="overflow-auto pb-4">
                <FloorCanvas
                  tables={isEditing ? (draftTables || tables) : tables}
                  selectedTableId={selectedTable?.id}
                  onSelectTable={handleSelectTable}
                  isEditing={isEditing}
                  onTableMove={handleTableMove}
                  onDeleteTable={confirmDeleteTable}
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <AnimatePresence mode="wait">
                  {selectedTable ? (
                    isEditing ? (
                      <EditTablePanel
                        key={`edit-${selectedTable.id}`}
                        table={selectedTable}
                        onChange={handleTableChange}
                        onDelete={() => confirmDeleteTable(selectedTable.id)}
                      />
                    ) : (
                      <TableDetails
                        key={selectedTable.id}
                        table={selectedTable}
                      />
                    )
                  ) : (
                    <Card className="rounded-[1.5rem] border border-border bg-card">
                      <div className="flex h-full min-h-[220px] flex-col items-center justify-center p-8 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary">
                          <Map className="h-7 w-7 text-[#D6B48C]" />
                        </div>

                        <h3 className="mt-5 text-xl font-semibold text-[#F8F5EF]">
                          Select a Table
                        </h3>

                        <p className="mt-2 max-w-sm text-sm text-[#8EA79D]">
                          Click any table on the floor to inspect its details
                          and perform actions.
                        </p>
                      </div>
                    </Card>
                  )}
                </AnimatePresence>

                <Card className="rounded-[1.5rem] border border-border bg-card p-6">
                  <h3 className="mb-6 text-lg font-semibold text-[#F8F5EF]">
                    Live Status
                  </h3>

                  <div className="space-y-3">
                    <LegendRow
                      color="bg-emerald-400"
                      label="Available"
                      count={
                        tables.filter((t) => t.status === "AVAILABLE").length
                      }
                    />

                    <LegendRow
                      color="bg-amber-400"
                      label="Reserved"
                      count={
                        tables.filter((t) => t.status === "RESERVED").length
                      }
                    />

                    <LegendRow
                      color="bg-rose-400"
                      label="Occupied"
                      count={
                        tables.filter((t) => t.status === "OCCUPIED").length
                      }
                    />

                    <LegendRow
                      color="bg-slate-400"
                      label="Maintenance"
                      count={
                        tables.filter((t) => t.status === "MAINTENANCE").length
                      }
                    />
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isAddTableOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Add New Table</h2>
                <button onClick={() => setIsAddTableOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddTable} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Table Number/Name</label>
                  <input name="number" required className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. 12 or Window-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Capacity</label>
                  <input name="capacity" type="number" min="1" max="20" required defaultValue="4" className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Shape</label>
                  <select name="shape" required className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="SQUARE">Square</option>
                    <option value="ROUND">Round</option>
                    <option value="RECTANGLE">Rectangle</option>
                    <option value="SOFA">Sofa</option>
                    <option value="BAR">Bar</option>
                    <option value="OUTDOOR">Outdoor</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsAddTableOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isAddingTable} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    {isAddingTable ? "Adding..." : "Add Table"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tableToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Delete Table?</h2>
                <button onClick={() => setTableToDelete(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <p className="text-muted-foreground text-sm mb-6">
                Are you sure you want to delete this table? This will remove the table from this floor permanently.
              </p>
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setTableToDelete(null)} className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleDeleteTable} 
                  disabled={isDeletingTable} 
                  className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 transition-colors"
                >
                  {isDeletingTable ? "Deleting..." : "Delete Table"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
