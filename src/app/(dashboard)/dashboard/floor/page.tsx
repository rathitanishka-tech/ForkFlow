"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FloorCanvas } from "@/components/floor/FloorCanvas";
import { TableDetails } from "@/components/floor/TableDetails";
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
  const [tables, setTables] = React.useState<TableNodeData[]>([]);
  const [selectedTable, setSelectedTable] =
    React.useState<TableNodeData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch("/api/tables");
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
  }, []);

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
          <h1 className="text-3xl font-semibold tracking-normal text-foreground">
            Floor Planner
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your restaurant&apos;s tables and layout in real-time.
          </p>
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
              <FloorCanvas
                tables={tables}
                selectedTableId={selectedTable?.id}
                onSelectTable={handleSelectTable}
              />

              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <AnimatePresence mode="wait">
                  {selectedTable ? (
                    <TableDetails
                      key={selectedTable.id}
                      table={selectedTable}
                    />
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
    </div>
  );
}
