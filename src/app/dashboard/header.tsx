"use client";

import { useEffect, useState } from "react";
import { Menu, Utensils } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "./sidebar";
import { UserMenu } from "./user-menu";

export function Header() {
  const [restaurantName, setRestaurantName] = useState("Govindas Restaurant");
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

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
          setRestaurantId(restaurants[0].id);
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
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu drawer trigger */}
        <div className="lg:hidden">
          <input
            id="dashboard-sidebar"
            type="checkbox"
            className="peer sr-only"
          />
          <label
            htmlFor="dashboard-sidebar"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-foreground transition hover:bg-muted"
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </label>
          <label
            htmlFor="dashboard-sidebar"
            className="fixed inset-0 z-40 hidden bg-black/50 backdrop-blur-xs peer-checked:block"
            aria-label="Close navigation"
          />
          <div className="fixed inset-y-0 left-0 z-50 hidden w-70 peer-checked:block">
            <Sidebar />
          </div>
        </div>

        {/* Restaurant Pill Badge */}
        <div className="flex h-9 items-center gap-2.5 rounded-full border border-border bg-card px-3.5 text-sm font-medium text-foreground shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="max-w-[200px] truncate sm:max-w-[320px]">{restaurantName}</span>
        </div>

        {/* Quick Menu View Link */}
        {restaurantId && (
          <Link
            href={`/menu/${restaurantId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/50 hover:text-foreground md:inline-flex"
          >
            <Utensils className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            <span>Public Menu</span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        <UserMenu />
      </div>
    </header>
  );
}
