"use client";

import * as React from "react";
import { TableQRCode } from "@/components/qr/TableQRCode";
import { Loader, AlertTriangle, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentRestaurant } from "@/lib/useCurrentRestaurant";

interface TableData {
  id: string;
  number: string;
}

function useTables(restaurantId?: string) {
  const [tables, setTables] = React.useState<TableData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!restaurantId) {
      return;
    }

    const fetchTables = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/tables?restaurantId=${restaurantId}`,
        );
        if (!response.ok) {
          throw new Error("Failed to load tables.");
        }
        const result = await response.json();
        setTables(result.data ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, [restaurantId]);

  return { tables, isLoading, error, setTables };
}

export default function QrCodePage() {
  const {
    restaurant,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useCurrentRestaurant();
  const { tables, isLoading, error } = useTables(restaurant?.id);
  const [selectedTable, setSelectedTable] = React.useState<TableData | null>(
    null,
  );
  const resolvedSelectedTable = selectedTable ?? tables[0] ?? null;

  if (restaurantLoading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (restaurantError || !restaurant) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center max-w-md">
          <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 text-xl font-bold text-foreground">
            Unable to load restaurant
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            {restaurantError ?? "No active restaurant is configured."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-5 shadow-xs sm:flex-row sm:items-center sm:px-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            QR Ordering Codes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate, preview, and download contactless digital menu QR codes for each table.
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Restaurant</p>
          <p className="text-sm font-bold text-foreground">{restaurant.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Table Selector Column */}
        <div className="flex h-[600px] flex-col rounded-2xl border border-border bg-card lg:col-span-5 shadow-xs">
          <div className="border-b border-border p-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">
              Tables Directory ({tables.length})
            </h2>
            <span className="text-xs text-muted-foreground">Select to preview</span>
          </div>
          <div className="grow overflow-y-auto p-2 space-y-1">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="p-4 text-center text-xs text-destructive">
                {error}
              </div>
            ) : tables.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No tables found on this floor.
              </div>
            ) : (
              tables.map((table) => {
                const isSelected = resolvedSelectedTable?.id === table.id;
                return (
                  <button
                    key={table.id}
                    onClick={() => setSelectedTable(table)}
                    className={`w-full p-3.5 rounded-xl text-left transition-all duration-150 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-[#216E46] text-white shadow-xs dark:bg-[#74A96B] dark:text-[#101712]"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span className="font-semibold text-sm">
                      Table {table.number}
                    </span>
                    <span className={`text-xs ${isSelected ? "text-white/80 dark:text-[#101712]/80" : "text-muted-foreground"}`}>
                      View Code →
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* QR Preview Column */}
        <div className="relative flex h-[600px] items-center justify-center rounded-2xl border border-border bg-muted/30 p-6 lg:col-span-7 shadow-xs">
          <AnimatePresence mode="wait">
            {resolvedSelectedTable && !isLoading ? (
              <motion.div
                key={resolvedSelectedTable.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full flex justify-center"
              >
                <TableQRCode
                  restaurantName={restaurant.name}
                  restaurantId={restaurant.id}
                  tableId={resolvedSelectedTable.id}
                  tableNumber={resolvedSelectedTable.number}
                  showUrl={true}
                />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center p-6"
              >
                <QrCode className="h-14 w-14 text-muted-foreground/40" />
                <h3 className="mt-4 text-base font-bold text-foreground">
                  {error ? "Error Loading Tables" : "No Table Selected"}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Select a table from the list on the left to preview and download its QR code.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
