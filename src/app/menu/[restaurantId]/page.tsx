"use client";

import * as React from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { MenuCard, MenuItemData } from "@/components/customer/MenuCard";
import { CategoryTabs } from "@/components/customer/CategoryTabs";
import { CartDrawer, CartItem } from "@/components/customer/CartDrawer";
import { useCustomerMenu } from "@/hooks/useCustomerMenu";
import { ShoppingBag, Loader, AlertTriangle, Utensils } from "lucide-react";

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
      alert("Table information is missing. Please scan a table QR code to order.");
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
        <div className="flex flex-1 flex-col items-center justify-center pt-24 text-muted-foreground">
          <Loader className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium">Preparing fresh menu...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 p-12 text-destructive my-8">
          <AlertTriangle className="h-10 w-10 mb-3" />
          <p className="text-lg font-bold">Unable to Load Menu</p>
          <p className="mt-1 text-xs text-muted-foreground">{error}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
        {filteredMenuItems.map((item: MenuItemData) => (
          <MenuCard key={item.id} menuItem={item} onAdd={handleAddToCart} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sticky Header with Category Tabs */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md pt-6 sm:pt-8">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-semibold">
            <Utensils className="h-3.5 w-3.5" />
            <span>Digital Table Menu</span>
          </div>
          <h1 className="mb-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Govindas Restaurant
          </h1>
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </header>

      {/* Main Menu Grid */}
      <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {renderContent()}
      </main>

      {/* Floating Cart Button */}
      {totalCartItemCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#216E46] text-white shadow-xl transition-transform hover:scale-105 active:scale-95 dark:bg-[#74A96B] dark:text-[#101712] cursor-pointer"
            aria-label={`Open cart with ${totalCartItemCount} items`}
          >
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-[#E5483F] text-xs font-bold text-white shadow-sm">
              {totalCartItemCount}
            </span>
          </button>
        </div>
      )}

      {/* Slide-out Cart Drawer */}
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
