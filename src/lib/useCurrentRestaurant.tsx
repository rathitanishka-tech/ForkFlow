"use client";

import { useEffect, useState } from "react";

export interface RestaurantSummary {
  id: string;
  name: string;
}

/**
 * Client hook that resolves the current restaurant by calling the server
 * endpoint /api/restaurant/current. The server resolves the restaurant
 * from the Clerk session — NEVER from localStorage.
 *
 * localStorage is NOT used for restaurant identity. The client has zero
 * control over which restaurant is accessed.
 */
export function useCurrentRestaurant() {
  const [restaurant, setRestaurant] = useState<RestaurantSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchRestaurant = async () => {
      try {
        const response = await fetch("/api/restaurant/current");

        if (!response.ok) {
          if (response.status === 401) {
            setError("You must be signed in.");
          } else if (response.status === 404) {
            setError("No restaurant is configured for your account.");
          } else {
            setError("Unable to load restaurant.");
          }
          return;
        }

        const data = await response.json();

        if (!cancelled) {
          setRestaurant({
            id: data.id,
            name: data.name,
          });
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load restaurant.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchRestaurant();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    restaurant,
    isLoading,
    error,
  };
}
