import * as React from "react";
import { X, Plus, Minus, ShoppingCart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartDrawerProps {
  items: CartItem[];
  total: number;
  isOpen: boolean;
  onClose: () => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onCheckout: () => void;
  checkoutLoading?: boolean;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const CartItemCard = ({
  item,
  onIncrease,
  onDecrease,
}: {
  item: CartItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
}) => (
  <div className="flex items-start gap-4 py-6">
    <div className="h-16 w-16 shrink-0 rounded-sm border border-[#E3DCD2] overflow-hidden shadow-sm">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="grow">
      <p className="font-heading text-lg font-bold text-[#2A2421]">
        {item.name}
      </p>
      <p className="font-sans text-sm font-medium text-[#5C544F]">
        {formatCurrency(item.price)}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => onDecrease(item.id)}
          className="flex h-6 w-6 items-center justify-center rounded-none border border-[#2A2421] text-[#2A2421] transition hover:bg-[#2A2421] hover:text-[#FAF8F5]"
          aria-label={`Decrease quantity of ${item.name}`}
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-4 text-center font-sans font-semibold text-[#2A2421]">
          {item.quantity}
        </span>
        <button
          onClick={() => onIncrease(item.id)}
          className="flex h-6 w-6 items-center justify-center rounded-none border border-[#2A2421] text-[#2A2421] transition hover:bg-[#2A2421] hover:text-[#FAF8F5]"
          aria-label={`Increase quantity of ${item.name}`}
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
    <p className="font-sans text-lg font-semibold text-[#2A2421]">
      {formatCurrency(item.price * item.quantity)}
    </p>
  </div>
);

const EmptyCart = () => (
  <div className="flex flex-1 flex-col items-center justify-center text-center">
    <ShoppingCart className="h-12 w-12 text-[#E3DCD2]" />
    <h3 className="mt-6 font-heading text-xl font-semibold tracking-widest text-[#2A2421] uppercase">
      Empty Order
    </h3>
    <p className="mt-2 font-sans text-sm text-[#5C544F]">
      Select items from the menu to begin.
    </p>
  </div>
);

export function CartDrawer({
  items,
  total,
  isOpen,
  onClose,
  onIncrease,
  onDecrease,
  onCheckout,
  checkoutLoading = false,
}: CartDrawerProps) {
  const totalItemCount = React.useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-all duration-300",
        isOpen ? "visible" : "invisible",
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-heading"
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-[#2A2421]/60 transition-opacity backdrop-blur-sm",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        className={cn(
          "fixed right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#F2EFE9] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-[#E3DCD2] p-6 pb-5">
          <h2 id="cart-heading" className="font-heading text-2xl font-bold uppercase tracking-widest text-[#2A2421]">
            Your Order
            {totalItemCount > 0 && (
              <span className="ml-3 font-sans text-lg font-medium text-[#8B2E2E]">
                {totalItemCount}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-[#2A2421] transition-transform hover:scale-110"
            aria-label="Close cart"
          >
            <X className="h-6 w-6 stroke-[1.5]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length > 0 ? (
            <div className="divide-y divide-[#E3DCD2]">
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onIncrease={onIncrease}
                  onDecrease={onDecrease}
                />
              ))}
            </div>
          ) : (
            <EmptyCart />
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#E3DCD2] bg-[#FAF8F5] p-6 pt-5 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.03)]">
            <div className="mb-6 flex justify-between items-end">
              <span className="font-heading text-lg font-bold tracking-widest text-[#5C544F] uppercase">
                Total
              </span>
              <span className="font-sans text-2xl font-bold text-[#2A2421]">
                {formatCurrency(total)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="flex w-full items-center justify-center rounded-none bg-[#2A2421] py-4 font-sans text-sm font-semibold uppercase tracking-widest text-[#FAF8F5] transition-colors hover:bg-[#8B2E2E] focus:outline-none focus:ring-2 focus:ring-[#8B2E2E] focus:ring-offset-2 focus:ring-offset-[#FAF8F5] disabled:cursor-not-allowed disabled:bg-[#E3DCD2] disabled:text-[#5C544F]"
              disabled={items.length === 0 || checkoutLoading}
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Sending to Kitchen...
                </>
              ) : (
                "Send Order to Kitchen"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
