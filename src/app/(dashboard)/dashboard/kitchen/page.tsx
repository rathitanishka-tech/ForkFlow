"use client";

import * as React from "react";
import { KitchenBoard } from "@/components/kitchen/KitchenBoard";
import {
  KitchenBoard as KitchenBoardType,
  KitchenOrderStatus,
} from "@/modules/kitchen/kitchen.types";
import { useCurrentRestaurant } from "@/lib/useCurrentRestaurant";

async function fetchKitchenBoard(restaurantId: string): Promise<KitchenBoardType> {
  const response = await fetch(`/api/kitchen?restaurantId=${restaurantId}`);
  if (!response.ok) {
    const errorData: { message?: string } = await response.json();
    throw new Error(errorData.message || "Failed to fetch kitchen board.");
  }

  return response.json();
}

export default function KitchenPage() {
  const {
    restaurant,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useCurrentRestaurant();
  const [board, setBoard] = React.useState<KitchenBoardType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!restaurant?.id) {
      return;
    }

    let isMounted = true;
    const restaurantId = restaurant.id;

    const loadBoard = async () => {
      try {
        setError(null);
        const data = await fetchKitchenBoard(restaurantId);
        if (isMounted) {
          setBoard(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadBoard();
    const interval = window.setInterval(() => {
      void loadBoard();
    }, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [restaurant?.id]);

  const handleStatusChange = async (
    orderId: string,
    status: KitchenOrderStatus,
  ) => {
    try {
      const response = await fetch(`/api/kitchen/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status.");
      }

      if (!restaurant?.id) {
        throw new Error("No restaurant is configured for the kitchen.");
      }

      const data = await fetchKitchenBoard(restaurant.id);
      setBoard(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      console.error("Update failed:", message);
    }
  };

  const renderContent = () => {
    if (restaurantLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <p className="text-slate-400 text-lg">Loading kitchen dashboard...</p>
        </div>
      );
    }

    if (restaurantError || !restaurant) {
      return (
        <div className="flex h-full items-center justify-center text-red-400">
          <p>
            {restaurantError ?? "No restaurant is configured for the kitchen."}
          </p>
        </div>
      );
    }

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
      );
    }

    if (board) {
      return <KitchenBoard board={board} onStatusChange={handleStatusChange} />;
    }
    return null;
  };

  return (
    <main className="flex min-h-0 w-full flex-col overflow-hidden rounded-[1.5rem] border border-[#29443C] bg-[#10231E] p-4 text-[#f8f5ef] shadow-[0_16px_45px_rgba(3,15,11,0.14)] md:p-6">
      <header className="mb-6 shrink-0">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8ea79d]">
          Kitchen
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[#f8f5ef]">
          Kitchen Dashboard
        </h1>
        <p className="mt-2 text-sm text-[#8ea79d]">
          Live orders for{" "}
          <span className="font-semibold text-[#f8f5ef]">
            {restaurant?.name ?? "your restaurant"}
          </span>
        </p>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto rounded-[1.25rem] border border-[#29443C] bg-[#081E19] p-3 text-[#f8f5ef] shadow-inner md:p-4">
        {renderContent()}
      </div>
    </main>
  );
}
