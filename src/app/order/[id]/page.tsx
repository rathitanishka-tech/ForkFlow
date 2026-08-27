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
        <div className="flex flex-col items-center justify-center border-y border-[#E3DCD2] py-16 text-[#8B2E2E]">
          <AlertTriangle className="h-10 w-10 mb-4" />
          <p className="font-heading text-xl font-semibold tracking-widest uppercase">
            We&apos;re Sorry
          </p>
          <p className="mt-2 text-center font-sans text-[#5C544F]">{error}</p>
        </div>
      );
    }

    if (order) {
      return <OrderStatusCard order={order} />;
    }

    return (
      <div className="border-y border-[#E3DCD2] bg-[#FAF8F5] py-12 text-[#5C544F]">
        <p className="text-center font-sans tracking-wide">Order data is unavailable.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#2A2421]">
      <main className="container mx-auto flex flex-col items-center px-4 py-12 sm:px-6 sm:py-20">
        <div className="w-full max-w-2xl">
          <header className="mb-10 flex flex-col items-center gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-[#5C544F] transition-colors hover:text-[#2A2421]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Menu
            </Link>
            <div className="text-center">
              <h1 className="font-heading text-3xl font-bold tracking-[0.2em] uppercase text-[#2A2421]">
                Your Order
              </h1>
              <div className="mx-auto mt-4 h-px w-16 bg-[#8B2E2E]" />
              <p className="mt-6 font-sans text-sm tracking-wide text-[#5C544F]">
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
