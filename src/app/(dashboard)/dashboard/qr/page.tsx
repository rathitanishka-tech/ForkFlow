"use client";

import * as React from "react";
import { TableQRCode } from "@/components/qr/TableQRCode";
import { Loader, AlertTriangle } from "lucide-react";
import { useCurrentRestaurant } from "@/lib/useCurrentRestaurant";

interface TableData {
  id: string;
  number: string;
}

export default function QrCodePage() {
  const {
    restaurant,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useCurrentRestaurant();
  const [tables, setTables] = React.useState<TableData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!restaurant?.id) {
      return;
    }

    const fetchTables = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/tables?restaurantId=${restaurant.id}`,
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
  }, [restaurant?.id]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-slate-500">
          <Loader className="h-10 w-10 animate-spin text-cyan-400" />
          <p className="mt-4 text-lg">Loading QR Codes...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-red-900/50 bg-red-900/10 p-8 text-red-400">
          <AlertTriangle className="h-10 w-10" />
          <p className="mt-4 text-lg font-semibold">{error}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {tables.map((table) => (
          <TableQRCode
            key={table.id}
            restaurantName={restaurant!.name}
            restaurantId={restaurant!.id}
            tableId={table.id}
            tableNumber={table.number}
          />
        ))}
      </div>
    );
  };

  if (restaurantLoading) {
    return (
      <main className="min-h-screen w-full bg-slate-900 p-4 text-white md:p-6">
        <div className="flex h-[calc(100vh-120px)] items-center justify-center">
          <Loader className="h-10 w-10 animate-spin text-cyan-400" />
        </div>
      </main>
    );
  }

  if (restaurantError || !restaurant) {
    return (
      <main className="min-h-screen w-full bg-slate-900 p-4 text-white md:p-6">
        <div className="flex h-[calc(100vh-120px)] items-center justify-center">
          <div className="rounded-2xl border border-red-800 bg-red-900/10 p-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
            <h1 className="mt-4 text-2xl font-bold text-white">Unable to load restaurant</h1>
            <p className="mt-2 text-sm text-slate-400">
              {restaurantError ?? "No active restaurant is configured."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-slate-900 p-4 text-white md:p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">QR Code Generator</h1>
        <p className="text-md mt-1 text-slate-400">
          Generate and download QR codes for each restaurant table.
        </p>
        <p className="mt-4 text-sm text-slate-400">
          Restaurant: <span className="font-medium text-white">{restaurant.name}</span>
        </p>
      </header>
      <div className="flex justify-center">
        <div className="w-full">{renderContent()}</div>
      </div>
    </main>
  );
}
