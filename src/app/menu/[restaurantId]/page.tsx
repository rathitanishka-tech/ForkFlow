"use client";

import * as React from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { MenuCard, MenuItemData } from "@/components/customer/MenuCard";
import { CategoryTabs } from "@/components/customer/CategoryTabs";
import { CartDrawer, CartItem } from "@/components/customer/CartDrawer";
import { useCustomerMenu } from "@/hooks/useCustomerMenu";
import { ShoppingBag, Loader, AlertTriangle } from "lucide-react";

export default function MenuPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const restaurantId = params.restaurantId as string;
  const tableId = searchParams.get("tableId");

  const { menuItems, categories, isLoading, error } =
    useCustomerMenu(restaurantId);

  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const handleAddToCart = (itemToAdd: MenuItemData) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === itemToAdd.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === itemToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prevItems,
        {
          id: itemToAdd.id,
          name: itemToAdd.name,
          price: itemToAdd.price,
          quantity: 1,
          imageUrl: itemToAdd.imageUrl,
        },
      ];
    });
  };

  const handleIncreaseQuantity = (itemId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const handleDecreaseQuantity = (itemId: string) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === itemId);
      if (itemToRemove?.quantity === 1) {
        return prevItems.filter((item) => item.id !== itemId);
      }
      return prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item,
      );
    });
  };

  const handleCheckout = async () => {
    if (!tableId) {
      alert("Table information is missing. Please scan a QR code.");
      return;
    }
    try {
      const response = await fetch("/api/public/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          tableId,
          items: cartItems.map((item: CartItem) => ({
            menuItemId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to place order.");
      }

      setCartItems([]);
      setIsCartOpen(false);
      router.push(`/order/${data.id}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      alert(`Checkout failed: ${message}`);
    }
  };

  const filteredMenuItems = React.useMemo(() => {
    if (selectedCategory === "All") return menuItems;
    return menuItems.filter(
      (item: MenuItemData) => item.category === selectedCategory,
    );
  }, [menuItems, selectedCategory]);

  const cartTotal = React.useMemo(
    () =>
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  const totalCartItemCount = React.useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center pt-20 text-slate-600">
          <Loader className="h-12 w-12 animate-spin text-[#0f5b4c]" />
          <p className="mt-4 text-lg">Loading Menu...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-red-500/50 bg-red-50 p-8 pt-20 text-red-700">
          <AlertTriangle className="h-12 w-12" />
          <p className="mt-4 text-lg font-semibold">
            Oops! Something went wrong.
          </p>
          <p className="text-red-600">{error}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMenuItems.map((item: MenuItemData) => (
          <MenuCard key={item.id} menuItem={item} onAdd={handleAddToCart} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-[#0f5b4c]/10 bg-[#f8f5ef]/90 p-4 backdrop-blur-xl">
        <div className="container mx-auto">
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6">{renderContent()}</main>

      {totalCartItemCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-foreground shadow-lg transition-transform hover:scale-105 hover:bg-[#0b4a3d]"
            aria-label={`Open cart with ${totalCartItemCount} items`}
          >
            <ShoppingBag className="h-8 w-8" />
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
              {totalCartItemCount}
            </span>
          </button>
        </div>
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        total={cartTotal}
        onIncrease={handleIncreaseQuantity}
        onDecrease={handleDecreaseQuantity}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
