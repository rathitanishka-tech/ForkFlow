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
        <div className="flex flex-1 flex-col items-center justify-center border-y border-[#E3DCD2] py-20 text-[#8B2E2E]">
          <AlertTriangle className="h-10 w-10 mb-4" />
          <p className="font-heading text-xl font-semibold tracking-widest uppercase">
            We&apos;re Sorry
          </p>
          <p className="mt-2 font-sans text-[#5C544F]">{error}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-x-16 gap-y-2 md:grid-cols-2">
        {filteredMenuItems.map((item: MenuItemData) => (
          <MenuCard key={item.id} menuItem={item} onAdd={handleAddToCart} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2A2421]">
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md pt-8 sm:pt-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 font-heading text-3xl font-bold tracking-[0.3em] uppercase text-[#2A2421] sm:text-4xl">
            M e n u
          </h1>
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {renderContent()}
      </main>

      {totalCartItemCount > 0 && (
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2A2421] text-[#FAF8F5] shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform hover:scale-105 hover:bg-[#1A1614]"
            aria-label={`Open cart with ${totalCartItemCount} items`}
          >
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#FAF8F5] bg-[#8B2E2E] font-sans text-xs font-bold text-white shadow-sm">
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
