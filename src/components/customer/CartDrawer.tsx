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
  <div className="flex items-start gap-3.5 py-4 border-b border-border/60 last:border-b-0">
    <div className="h-16 w-16 shrink-0 rounded-xl border border-border overflow-hidden bg-muted">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground/30 text-xs">
          Dish
        </div>
      )}
    </div>
    <div className="grow min-w-0">
      <p className="font-bold text-sm text-foreground truncate">
        {item.name}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {formatCurrency(item.price)} each
      </p>
      <div className="mt-2.5 flex items-center gap-2.5">
        <button
          onClick={() => onDecrease(item.id)}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground transition hover:bg-muted active:scale-95 cursor-pointer"
          aria-label={`Decrease quantity of ${item.name}`}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 text-center text-xs font-bold text-foreground">
          {item.quantity}
        </span>
        <button
          onClick={() => onIncrease(item.id)}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground transition hover:bg-muted active:scale-95 cursor-pointer"
          aria-label={`Increase quantity of ${item.name}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
    <p className="text-sm font-bold text-foreground shrink-0">
      {formatCurrency(item.price * item.quantity)}
    </p>
  </div>
);

const EmptyCart = () => (
  <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
      <ShoppingCart className="h-8 w-8" />
    </div>
    <h3 className="mt-4 text-base font-bold text-foreground">
      Your Order is Empty
    </h3>
    <p className="mt-1 text-xs text-muted-foreground">
      Select delicious items from the menu to get started.
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
          "absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 flex h-full w-full max-w-md flex-col bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2.5">
            <h2 id="cart-heading" className="text-lg font-bold text-foreground">
              Your Order
            </h2>
            {totalItemCount > 0 && (
              <span className="rounded-full bg-[#E5483F] px-2 py-0.5 text-[11px] font-bold text-white">
                {totalItemCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2">
          {items.length > 0 ? (
            <div className="divide-y divide-border/60">
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
          <div className="border-t border-border bg-muted/30 p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Order Total
              </span>
              <span className="text-xl font-bold text-foreground">
                {formatCurrency(total)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              disabled={items.length === 0 || checkoutLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#216E46] py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#1b5838] active:scale-98 dark:bg-[#74A96B] dark:text-[#101712] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending to Kitchen...</span>
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
