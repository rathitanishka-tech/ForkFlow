"use client";

import * as React from "react";
import { KitchenBoard } from "@/components/kitchen/KitchenBoard";
import {
  KitchenBoard as KitchenBoardType,
  KitchenOrderStatus,
} from "@/modules/kitchen/kitchen.types";

// In a real app, this would come from session, context, or URL params.
const RESTAURANT_ID = "acdb8f60-6b1b-4a0f-99a6-3f078a0c4f41";

export default function KitchenPage() {
  const [board, setBoard] = React.useState<KitchenBoardType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchBoard = React.useCallback(async () => {
    try {
      const response = await fetch(
        `/api/kitchen?restaurantId=${RESTAURANT_ID}`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch kitchen board.");
      }
      const data: KitchenBoardType = await response.json();
      setBoard(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBoard();
    // Optional: Set up polling to refresh the board periodically
    const interval = setInterval(fetchBoard, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchBoard]);

  const handleStatusChange = async (
    orderId: string,
    status: KitchenOrderStatus,
  ) => {
    try {
      // Optimistic UI update can be added here for a smoother experience
      const response = await fetch(`/api/kitchen/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status.");
      }

      // Refetch the board to get the latest state
      await fetchBoard();
    } catch (err: any) {
      console.error("Update failed:", err.message);
      // Optionally revert optimistic update and show an error toast
    }
  };

  const renderContent = () => {
    if (isLoading && !board) {
      return (
        <div className="flex h-full items-center justify-center">
          <p className="text-slate-400 text-lg">Loading kitchen dashboard...</p>
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

    if (board) {
      return <KitchenBoard board={board} onStatusChange={handleStatusChange} />;
    }

    return null;
  };

  return (
    <main className="h-screen w-full bg-slate-900 p-4 text-white md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Kitchen Dashboard</h1>
        <p className="text-md text-slate-400">Live Orders</p>
      </header>
      <div className="h-[calc(100vh-120px)]">{renderContent()}</div>
    </main>
  );
}
