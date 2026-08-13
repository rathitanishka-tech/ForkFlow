import { Prisma, PrismaClient } from "@prisma/client";
import {
  MenuFilters,
  MenuItemResponse,
  MenuListResponse,
} from "./menu.types";
import { CreateMenuItemInput, UpdateMenuItemInput } from "./menu.validator";

/**
 * Maps a menu item name to the correct local image file in /menu_items/.
 * The mapping is based on the predefined food items that have real local
 * images available. If no match is found, the original image (if any) is
 * returned unchanged.
 */
const LOCAL_MENU_IMAGE_MAP: Record<string, string> = {
  "Paneer Butter Masala": "/menu_items/item1.jpg",
  "Veg Hakka Noodles": "/menu_items/item2.jpg",
  "Veg Fried Rice Combo": "/menu_items/item3.jpg",
  "Grilled Veg Sandwich": "/menu_items/item4.jpg",
  "Classic Chicken Burger": "/menu_items/item5.jpg",
  "Chicken Tikka": "/menu_items/item6.jpg",
  "Veg Platter": "/menu_items/item7.jpg",
  "Paneer Chilli": "/menu_items/item8.jpg",
};

/**
 * Resolves the correct local image URL for a menu item.
 * If the item's name matches one of the predefined local images, that
 * image is returned. Otherwise, the existing image (if any) is preserved.
 * @param name - The name of the menu item.
 * @param existingImage - The image URL currently stored in the database.
 * @returns The resolved image URL, or null if none is available.
 */
export function resolveMenuItemImage(
  name: string,
  existingImage: string | null,
): string | null {
  const localImage = LOCAL_MENU_IMAGE_MAP[name];
  if (localImage) {
    return localImage;
  }
  return existingImage;
}

export class MenuService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Creates a new menu item.
   * It ensures the parent restaurant exists and the item name is unique within the restaurant.
   * @param input - The data for the new menu item (restaurantId is server-resolved).
   * @returns The newly created menu item.
   * @throws Error if the restaurant is not found or if the name is a duplicate.
   */
  async createMenuItem(input: CreateMenuItemInput): Promise<MenuItemResponse> {
    return this.prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.findUnique({
        where: { id: input.restaurantId },
        select: { id: true },
      });

      if (!restaurant) {
        throw new Error("Restaurant not found.");
      }

      try {
        return await tx.menuItem.create({
          data: input,
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new Error(
            `A menu item with the name "${input.name}" already exists in this restaurant.`,
          );
        }
        throw error;
      }
    });
  }

  /**
   * Retrieves a paginated and filtered list of menu items.
   * @param filters - The filtering and pagination criteria.
   * @returns A paginated list of menu items.
   */
  async getMenuItems(filters: MenuFilters = {}): Promise<MenuListResponse> {
    const {
      restaurantId,
      category,
      isAvailable,
      isVeg,
      spiceLevel,
      search,
      page = 1,
      limit = 10,
    } = filters;

    const where: Prisma.MenuItemWhereInput = {
      restaurantId,
      category,
      isAvailable,
      isVeg,
      spiceLevel,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.menuItem.findMany({
        where,
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
          isAvailable: true,
          isVeg: true,
          spiceLevel: true,
          category: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
      }),
      this.prisma.menuItem.count({ where }),
    ]);

    return {
      data: items,
      total,
      page,
      limit,
    };
  }

  /**
   * Finds a single menu item by its unique ID, scoped to the given restaurant.
   * @param id - The ID of the menu item to find.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The menu item if found and owned by the restaurant, otherwise null.
   */
  async getMenuItemById(
    id: string,
    restaurantId: string,
  ): Promise<MenuItemResponse | null> {
    return this.prisma.menuItem.findFirst({
      where: { id, restaurantId },
    });
  }

  /**
   * Updates an existing menu item's information, scoped to the given restaurant.
   * @param id - The ID of the menu item to update.
   * @param input - The data to update.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated menu item.
   * @throws Error if the item is not found or if the new name is a duplicate.
   */
  async updateMenuItem(
    id: string,
    input: UpdateMenuItemInput,
    restaurantId: string,
  ): Promise<MenuItemResponse> {
    const item = await this.getMenuItemById(id, restaurantId);
    if (!item) {
      throw new Error("Menu item not found");
    }

    try {
      return await this.prisma.menuItem.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error(
          `A menu item with the name "${input.name}" already exists in this restaurant.`,
        );
      }
      throw error;
    }
  }

  /**
   * Toggles the availability of a menu item, scoped to the given restaurant.
   * @param id - The ID of the menu item to toggle.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated menu item.
   * @throws Error if the menu item is not found.
   */
  async toggleAvailability(
    id: string,
    restaurantId: string,
  ): Promise<MenuItemResponse> {
    const item = await this.getMenuItemById(id, restaurantId);
    if (!item) {
      throw new Error("Menu item not found");
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable: !item.isAvailable },
    });
  }

  /**
   * Soft deletes a menu item by setting its `isAvailable` flag to false, scoped to the given restaurant.
   * This is an idempotent operation.
   * @param id - The ID of the menu item to delete.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated menu item with `isAvailable: false`.
   * @throws Error if the menu item is not found.
   */
  async deleteMenuItem(
    id: string,
    restaurantId: string,
  ): Promise<MenuItemResponse> {
    const item = await this.getMenuItemById(id, restaurantId);
    if (!item) {
      throw new Error("Menu item not found");
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable: false },
    });
  }
}
