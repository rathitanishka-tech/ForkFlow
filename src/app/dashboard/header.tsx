"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Sidebar } from "./sidebar";
import { UserMenu } from "./user-menu";

export function Header() {
  const [restaurantName, setRestaurantName] = useState("ForkFlow");

  useEffect(() => {
    let isMounted = true;

    const loadRestaurant = async () => {
      try {
        const response = await fetch("/api/restaurants");
        if (!response.ok) {
          return;
        }

        const result = await response.json();
        const restaurants = Array.isArray(result.restaurants)
          ? result.restaurants
          : [];

        if (isMounted && restaurants.length > 0) {
          setRestaurantName(restaurants[0].name);
        }
      } catch {
      }
    };

    loadRestaurant();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-[#1f3d30] bg-[#0a1f18]/95 px-4 backdrop-blur-xl lg:px-6">
      <div className="lg:hidden">
        <input
          id="dashboard-sidebar"
          type="checkbox"
          className="peer sr-only"
        />
        <label
          htmlFor="dashboard-sidebar"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-[#1f3d30] bg-[#10251e] text-[#f8f5ef] transition hover:bg-[#153426]"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </label>
        <label
          htmlFor="dashboard-sidebar"
          className="fixed inset-0 z-40 hidden bg-[#071812]/70 peer-checked:block"
          aria-label="Close navigation"
        />
        <div className="fixed inset-y-0 left-0 z-50 hidden w-70 peer-checked:block">
          <Sidebar />
        </div>
      </div>

      <div className="flex h-10 min-w-0 items-center rounded-full border border-[#29443C] bg-[#10231E] px-3 text-sm font-medium text-[#f8f5ef] backdrop-blur">
        <span className="truncate">{restaurantName}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <UserMenu />
      </div>
    </header>
  );
}
