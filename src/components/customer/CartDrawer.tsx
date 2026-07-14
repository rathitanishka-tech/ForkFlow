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
  <div className="flex items-center gap-4 py-4">
    <img
      src={item.imageUrl}
      alt={item.name}
      className="h-16 w-16 rounded-lg object-cover"
    />
    <div className="flex-grow">
      <p className="font-semibold text-slate-100">{item.name}</p>
      <p className="text-sm text-slate-400">{formatCurrency(item.price)}</p>
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={() => onDecrease(item.id)}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 text-slate-400 transition hover:bg-slate-700 hover:text-white"
          aria-label={`Decrease quantity of ${item.name}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-4 text-center font-medium text-slate-200">
          {item.quantity}
        </span>
        <button
          onClick={() => onIncrease(item.id)}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 text-slate-400 transition hover:bg-slate-700 hover:text-white"
          aria-label={`Increase quantity of ${item.name}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
    <p className="font-semibold text-slate-200">
      {formatCurrency(item.price * item.quantity)}
    </p>
  </div>
);

const EmptyCart = () => (
  <div className="flex flex-1 flex-col items-center justify-center text-center">
    <ShoppingCart className="h-16 w-16 text-slate-600" />
    <h3 className="mt-4 text-xl font-semibold text-slate-300">
      Your cart is empty
    </h3>
    <p className="mt-1 text-slate-500">
      Add some delicious food to get started!
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
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/60 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 flex h-full w-full max-w-md flex-col bg-slate-900 shadow-2xl shadow-black/50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h2 id="cart-heading" className="text-xl font-bold text-white">
            Your Cart{" "}
            {totalItemCount > 0 && (
              <span className="ml-2 text-lg font-medium text-slate-400">
                ({totalItemCount})
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Close cart"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-4">
          {items.length > 0 ? (
            <div className="divide-y divide-slate-800">
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

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-800 bg-slate-900 p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.2)]">
            <div className="mb-4 flex justify-between text-lg">
              <span className="font-medium text-slate-300">Grand Total</span>
              <span className="font-bold text-white">
                {formatCurrency(total)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="flex w-full items-center justify-center rounded-lg bg-cyan-500 py-3 text-lg font-bold text-white transition-colors hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700"
              disabled={items.length === 0 || checkoutLoading}
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
