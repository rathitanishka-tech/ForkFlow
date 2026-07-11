"use client";

import * as React from "react";
import { FloorCanvas } from "@/components/floor/FloorCanvas";
import { TableDetails } from "@/components/floor/TableDetails";
import { TableNodeData } from "@/components/floor/TableNode";

export default function FloorPlanPage() {
  const [tables, setTables] = React.useState<TableNodeData[]>([]);
  const [selectedTable, setSelectedTable] =
    React.useState<TableNodeData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTables = async () => {
      try {
        // In a real app, you might pass a floorId or restaurantId
        const response = await fetch("/api/tables");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch tables.");
        }
        const result = await response.json();
        // Filter for active tables as inactive ones shouldn't be on the floor plan
        setTables(result.data.filter((t: TableNodeData) => t.isActive));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, []);

  const handleSelectTable = (table: TableNodeData) => {
    // Deselect if the same table is clicked again
    if (selectedTable?.id === table.id) {
      setSelectedTable(null);
    } else {
      setSelectedTable(table);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <p className="text-lg text-slate-400">Loading Floor Plan...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-full items-center justify-center text-red-400">
          <p>Error: {error}</p>
        </div>
      );
    }

    return (
      <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
        <div className="h-full lg:col-span-2 xl:col-span-3">
          <FloorCanvas
            tables={tables}
            selectedTableId={selectedTable?.id}
            onSelectTable={handleSelectTable}
          />
        </div>
        <div className="h-full lg:col-span-1">
          <TableDetails table={selectedTable} />
        </div>
      </div>
    );
  };

  return (
    <main className="h-screen w-full bg-slate-900 p-4 text-white md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Floor Layout</h1>
        <p className="text-md text-slate-400">Interactive Restaurant Map</p>
      </header>
      <div className="h-[calc(100vh-120px)]">{renderContent()}</div>
    </main>
  );
}
