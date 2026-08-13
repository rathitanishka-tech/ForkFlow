import * as React from "react";
import { CustomerOrder } from "@/components/customer/OrderStatusCard";

export function useCustomerOrder(orderId: string | string[] | undefined) {
  const [order, setOrder] = React.useState<CustomerOrder | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!orderId) {
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/public/orders/${orderId}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch order status.");
        }
        const data: CustomerOrder = await response.json();
        if (isMounted) {
          setOrder(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError" && isMounted) {
          setError(err.message);
        } else if (isMounted) {
          setError("An unknown error occurred.");
        }
      } finally {
        if (isMounted && isLoading) setIsLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      controller.abort();
    };
  }, [orderId, isLoading]);

  return { order, isLoading, error };
}
