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
      <div className="flex h-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-[#8EA79D]" />
      </div>
    );
  }

  if (restaurantError || !restaurant) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-rose-400" />
          <h1 className="mt-4 text-2xl font-bold text-[#F8F5EF]">
            Unable to load restaurant
          </h1>
          <p className="mt-2 text-sm text-[#8EA79D]">
            {restaurantError ?? "No active restaurant is configured."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-[1.6rem] border border-border bg-card px-5 py-5 shadow-xl sm:flex-row sm:items-end sm:px-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground">
            QR Code Manager
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Generate, preview, and download QR codes for your tables.
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="text-[#8EA79D]">Restaurant</p>
          <p className="font-semibold text-[#F8F5EF]">{restaurant.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex h-[600px] flex-col rounded-[1.5rem] border border-border bg-card lg:col-span-1">
          <div className="border-b border-border p-4">
            <h2 className="font-semibold text-foreground">
              Tables ({tables.length})
            </h2>
          </div>
          <div className="grow overflow-y-auto">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="p-4 text-center text-sm text-rose-500">
                {error}
              </div>
            ) : tables.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No tables found.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {tables.map((table) => (
                  <li key={table.id}>
                    <button
                      onClick={() => setSelectedTable(table)}
                      className={`w-full p-4 text-left transition-colors duration-200 ${
                        resolvedSelectedTable?.id === table.id
                          ? "bg-accent/10 text-accent-foreground"
                          : "hover:bg-accent/5 hover:text-accent-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          Table {table.number}
                        </span>
                        {resolvedSelectedTable?.id === table.id && (
                          <div className="h-2 w-2 rounded-full bg-accent"></div>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="relative h-[600px] rounded-[1.5rem] border border-border bg-gradient-to-br from-[#16352D] via-[#10231E] to-[#10231E] p-6 lg:col-span-2">
          <AnimatePresence mode="wait">
            {resolvedSelectedTable && !isLoading ? (
              <motion.div
                key={resolvedSelectedTable.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex h-full flex-col items-center justify-center"
              >
                <TableQRCode
                  restaurantName={restaurant.name}
                  restaurantId={restaurant.id}
                  tableId={resolvedSelectedTable.id}
                  tableNumber={resolvedSelectedTable.number}
                  qrOptions={{
                    color: {
                      dark: "#F8F5EF", // QR code dots
                      light: "#10231E", // QR code background
                    },
                  }}
                  showUrl={false}
                />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full flex-col items-center justify-center text-center"
              >
                {isLoading ? (
                  <Loader className="h-8 w-8 animate-spin text-[#8EA79D]" />
                ) : (
                  <>
                    <QrCode className="h-16 w-16 text-[#8EA79D]/50" />
                    <h3 className="mt-6 text-xl font-semibold text-[#F8F5EF]">
                      {error ? "Error Loading Tables" : "No Table Selected"}
                    </h3>
                    <p className="mt-2 text-sm text-[#8EA79D]">
                      {error
                        ? error
                        : "Select a table from the list to view its QR code."}
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
