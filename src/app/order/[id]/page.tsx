"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  OrderStatusCard,
  CustomerOrder,
} from "@/components/customer/OrderStatusCard";
import { AlertTriangle, Loader, ArrowLeft } from "lucide-react";

export default function OrderStatusPage() {
  const params = useParams();
  const id = params?.id;
  const [order, setOrder] = React.useState<CustomerOrder | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;

    let mounted = true;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch order status.");
        }
        const data: CustomerOrder = await response.json();
        if (mounted) {
          setOrder(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred.",
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 2000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
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

    return (
      <div className="rounded-lg border border-neutral-800 bg-slate-900 p-8 text-slate-400">
        <p className="text-center">Order data is unavailable.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <main className="container mx-auto flex flex-col items-center p-4 pt-10 sm:p-6 sm:pt-16">
        <div className="w-full max-w-2xl">
          <header className="mb-6 flex flex-col gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Home
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-100">
                Your Order Status
              </h1>
              <p className="text-md text-slate-400">
                We'll keep this page updated in real-time.
              </p>
            </div>
          </header>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
