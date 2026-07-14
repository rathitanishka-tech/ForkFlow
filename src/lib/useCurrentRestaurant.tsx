"use client";

import { useEffect, useState } from "react";

export interface RestaurantSummary {
  id: string;
  name: string;
}

export function useCurrentRestaurant() {
  const [restaurant, setRestaurant] = useState<RestaurantSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRestaurant = async () => {
      try {
        const response = await fetch("/api/restaurants");
        if (!response.ok) {
          throw new Error("Failed to load restaurant information.");
        }

        const result = await response.json();
        const restaurants = Array.isArray(result.restaurants)
          ? result.restaurants
          : [];

        if (isMounted && restaurants.length > 0) {
          setRestaurant({
            id: restaurants[0].id,
            name: restaurants[0].name,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load restaurant data.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRestaurant();

    return () => {
      isMounted = false;
    };
  }, []);

  return { restaurant, isLoading, error };
}
