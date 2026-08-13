import * as React from "react";
import { MenuItemData } from "@/components/customer/MenuCard";

interface PublicMenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  spiceLevel: MenuItemData["spiceLevel"];
  category: string;
  isAvailable: boolean;
  isVeg: boolean;
  image: string | null;
}

/**
 * Maps a menu item name to the correct local image file in /menu_items/.
 * The mapping is based on the predefined food items that have real local
 * images available. If no match is found, the original image (if any) is
 * returned unchanged.
 */
const LOCAL_MENU_IMAGE_MAP: Record<string, string> = {
  "Paneer Butter Masala": "/menu_items/item1.jpg",
  "Veg Hakka Noodles": "/menu_items/item2.jpg",
  "Veg Fried Rice": "/menu_items/item3.jpg",
  "Grilled Veg Sandwich": "/menu_items/item4.jpg",
  "Classic Chicken Burger": "/menu_items/item5.jpg",
  "Chicken Tikka": "/menu_items/item6.jpg",
  "Veg Platter": "/menu_items/item7.jpg",
  "Paneer Chilli": "/menu_items/item8.jpg",

  "Paneer Tikka": "/menu_items/item1.jpg",
  "Creamy White Sauce Pasta": "/menu_items/item2.jpg",
  "Cold Coffee": "/menu_items/item3.jpg",
};

/**
 * Resolves the correct local image URL for a menu item.
 * If the item's name matches one of the predefined local images, that
 * image is returned. Otherwise, the existing image (if any) is preserved.
 * @param name - The name of the menu item.
 * @param existingImage - The image URL currently stored in the database.
 * @returns The resolved image URL.
 */
function resolveMenuItemImage(name: string, existingImage: string): string {
  const localImage = LOCAL_MENU_IMAGE_MAP[name];
  if (localImage) {
    return localImage;
  }
  return existingImage;
}

export function useCustomerMenu(restaurantId: string | null) {
  const [menuItems, setMenuItems] = React.useState<MenuItemData[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!restaurantId) {
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchMenu = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/public/menu?restaurantId=${restaurantId}`,
          {
            signal: controller.signal,
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch menu data.");
        }

        const result: { data: PublicMenuItem[] } = await response.json();

        if (isMounted) {
          const mappedMenu: MenuItemData[] = result.data.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description ?? "",
            price: item.price,
            spiceLevel: item.spiceLevel,
            category: item.category,
            isAvailable: item.isAvailable,
            isVeg: item.isVeg,
            imageUrl: resolveMenuItemImage(item.name, item.image ?? ""),
          }));

          setMenuItems(mappedMenu);
          const uniqueCategories = [
            "All",
            ...new Set(
              mappedMenu
                .map((item) => item.category)
                .filter(Boolean) as string[],
            ),
          ];
          setCategories(uniqueCategories);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError" && isMounted) {
          setError(err.message);
        } else if (isMounted) {
          setError("An unknown error occurred.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMenu();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [restaurantId]);

  return { menuItems, categories, isLoading, error };
}
