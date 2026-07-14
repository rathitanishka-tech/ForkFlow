"use client";

import * as React from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { MenuCard, MenuItemData } from "@/components/customer/MenuCard";
import { CategoryTabs } from "@/components/customer/CategoryTabs";
import { CartDrawer, CartItem } from "@/components/customer/CartDrawer";
import { ShoppingBag, Loader, AlertTriangle } from "lucide-react";

export default function MenuPage() {
  // Hooks for routing and parameters
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const restaurantId = params.restaurantId as string;
  const tableId = searchParams.get("tableId");

  // State management
  const [menuItems, setMenuItems] = React.useState<MenuItemData[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Effect to fetch menu data when the restaurantId changes
  React.useEffect(() => {
    if (!restaurantId) return;

    const fetchMenu = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/menu?restaurantId=${restaurantId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch menu data.");
        }

        const result = (await response.json()) as {
          data: Array<
            Partial<Omit<MenuItemData, "imageUrl">> & {
              image?: string | null;
              category?: string | null;
            }
          >;
        };

        const mappedMenu: MenuItemData[] = result.data.map((item) => ({
          id: item.id ?? "",
          name: item.name ?? "",
          description: item.description ?? "",
          price: item.price ?? 0,
          spiceLevel: item.spiceLevel ?? "NONE",
          category: item.category ?? "Uncategorized",
          isAvailable: item.isAvailable ?? false,
          isVeg: item.isVeg ?? false,
          imageUrl: item.image ?? "",
        }));

        setMenuItems(mappedMenu);
        const uniqueCategories = [
          "All",
          ...Array.from(
            new Set(
              mappedMenu
                .map((menuItem) => menuItem.category)
                .filter(
                  (category): category is string =>
                    typeof category === "string" && category.length > 0,
                ),
            ),
          ),
        ];
        setCategories(uniqueCategories);
        setSelectedCategory("All");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setError(errorMessage);
        console.error("Failed to fetch menu:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  // Cart management functions
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
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          tableId,
          items: cartItems.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to place order.");
      }

      // Clear cart and redirect to the order status page
      setCartItems([]);
      setIsCartOpen(false);
      router.push(`/order/${data.id}`);
    } catch (error: any) {
      alert(`Checkout failed: ${error.message}`);
    }
  };

  // Memoized calculations for performance
  const filteredMenuItems = React.useMemo(() => {
    if (selectedCategory === "All") return menuItems;
    return menuItems.filter((item) => item.category === selectedCategory);
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

  // Conditional rendering for different UI states
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center pt-20 text-slate-500">
          <Loader className="h-12 w-12 animate-spin text-cyan-400" />
          <p className="mt-4 text-lg">Loading Menu...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-red-900/50 bg-red-900/10 p-8 pt-20 text-red-400">
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
