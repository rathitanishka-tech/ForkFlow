"use client";

import * as React from "react";
import {
  OrderStatusCard,
  CustomerOrder,
} from "@/components/customer/OrderStatusCard";
import { AlertTriangle, Loader } from "lucide-react";

export default function OrderStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [order, setOrder] = React.useState<CustomerOrder | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch order status.");
        }
        const data: CustomerOrder = await response.json();
        setOrder(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchOrder();

    // Set up polling every 2 seconds
    const interval = setInterval(fetchOrder, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [id]);

  const renderContent = () => {
    if (isLoading) {
      return <OrderStatusCard order={{} as CustomerOrder} loading />;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-red-900/50 bg-red-900/10 p-8 text-red-400">
          <AlertTriangle className="h-12 w-12" />
          <p className="mt-4 text-lg font-semibold">
            Oops! Something went wrong.
          </p>
          <p className="text-center text-red-500">{error}</p>
        </div>
      );
    }

    if (order) {
      return <OrderStatusCard order={order} />;
    }

    return null;
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <main className="container mx-auto flex flex-col items-center p-4 pt-10 sm:p-6 sm:pt-16">
        <div className="w-full max-w-2xl">
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-slate-100">
              Your Order Status
            </h1>
            <p className="text-md text-slate-400">
              We'll keep this page updated in real-time.
            </p>
          </header>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
