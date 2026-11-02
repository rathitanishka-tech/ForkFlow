"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  OrderStatusCard,
  CustomerOrder,
} from "@/components/customer/OrderStatusCard";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useCustomerOrder } from "@/hooks/useCustomerOrder";

export default function OrderStatusPage() {
  const params = useParams();
  const { order, isLoading, error } = useCustomerOrder(params?.id);

  const renderContent = () => {
    if (isLoading) {
      return <OrderStatusCard order={{} as CustomerOrder} loading />;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 p-12 text-destructive my-6">
          <AlertTriangle className="h-10 w-10 mb-3" />
          <p className="text-lg font-bold">Unable to Load Order</p>
          <p className="mt-1 text-center text-xs text-muted-foreground">{error}</p>
        </div>
      );
    }

    if (order) {
      return <OrderStatusCard order={order} />;
    }

    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
        <p className="text-sm">Order information is currently unavailable.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
      <main className="container mx-auto flex flex-col items-center px-4 py-8 sm:px-6 sm:py-16">
        <div className="w-full max-w-2xl">
          <header className="mb-8 flex flex-col items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to Home
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Order Status Tracker
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Your order is automatically updated in real-time as the kitchen cooks.
              </p>
            </div>
          </header>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
