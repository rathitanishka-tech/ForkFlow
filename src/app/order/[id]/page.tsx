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
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-red-500/50 bg-red-50 p-8 text-red-700">
          <AlertTriangle className="h-12 w-12" />
          <p className="mt-4 text-lg font-semibold">
            Oops! Something went wrong.
          </p>
          <p className="text-center text-red-600">{error}</p>
        </div>
      );
    }

    if (order) {
      return <OrderStatusCard order={order} />;
    }

    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-slate-500">
        <p className="text-center">Order data is unavailable.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f5ef] text-slate-900">
      <main className="container mx-auto flex flex-col items-center p-4 pt-10 sm:p-6 sm:pt-16">
        <div className="w-full max-w-2xl">
          <header className="mb-6 flex flex-col gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#0f5b4c] transition-colors hover:text-[#0b4a3d]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Home
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-950">
                Your Order Status
              </h1>
              <p className="text-md text-slate-600">
                We&apos;ll keep this page updated in real-time.
              </p>
            </div>
          </header>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
