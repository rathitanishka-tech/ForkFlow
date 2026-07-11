"use client";

import * as React from "react";
import { MenuCard, MenuItemData } from "@/components/customer/MenuCard";
import { CategoryTabs } from "@/components/customer/CategoryTabs";
import { CartDrawer, CartItem } from "@/components/customer/CartDrawer";
import { ShoppingBag, Loader, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = React.use(params);
  const router = useRouter();
  const [menuItems, setMenuItems] = React.useState<MenuItemData[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/menu?restaurantId=${restaurantId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch menu data.");
        }
        const result = await response.json();
        const data: MenuItemData[] = result.data;

        const menu = result.data.map((item: any) => ({
          ...item,
          imageUrl: item.image,
        }));

        // Assuming the API returns items with a 'category' property
        const uniqueCategories = [
          "All",
          ...Array.from(new Set(menu.map((item) => item.category))),
        ];

        setMenuItems(menu);
        setCategories(uniqueCategories);
        setSelectedCategory("All");
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

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
      const existingItem = prevItems.find((item) => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item,
        );
      }
      // Remove item if quantity is 1 or less
      return prevItems.filter((item) => item.id !== itemId);
    });
  };

  const filteredMenuItems = React.useMemo(() => {
    if (selectedCategory === "All") {
      return menuItems;
    }
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  const cartTotal = React.useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [cartItems]);

  const totalCartItemCount = React.useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId: restaurantId,

          // Temporary table for demo
          tableId: "b5171f41-8782-4f81-aa15-10454fd1efdd",

          items: cartItems.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      setCartItems([]);
      setIsCartOpen(false);
      router.push(`/order/${data.id}`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center text-slate-500">
          <Loader className="h-12 w-12 animate-spin text-cyan-400" />
          <p className="mt-4 text-lg">Loading Menu...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-red-900/50 bg-red-900/10 p-8 text-red-400">
          <AlertTriangle className="h-12 w-12" />
          <p className="mt-4 text-lg font-semibold">
            Oops! Something went wrong.
          </p>
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMenuItems.map((item) => (
          <MenuCard key={item.id} menuItem={item} onAdd={handleAddToCart} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-30 bg-slate-950/80 p-4 backdrop-blur-lg">
        <div className="container mx-auto">
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6">{renderContent()}</main>

      {/* Floating Cart Button */}
      {totalCartItemCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-white shadow-lg transition-transform hover:scale-105"
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
