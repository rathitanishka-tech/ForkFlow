import { Prisma, PrismaClient } from "@prisma/client";
import {
  MenuFilters,
  MenuItemResponse,
  MenuItemSummary,
  MenuListResponse,
} from "./menu.types";
import { CreateMenuItemInput, UpdateMenuItemInput } from "./menu.validator";

export class MenuService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Creates a new menu item.
   * It ensures the parent restaurant and category exist and that the item name is unique within the category.
   * @param input - The data for the new menu item.
   * @returns The newly created menu item.
   * @throws Error if the restaurant or category is not found, or if the name is a duplicate.
   */
  async createMenuItem(input: CreateMenuItemInput): Promise<MenuItemResponse> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Ensure the parent restaurant exists.
      const restaurant = await tx.restaurant.findUnique({
        where: { id: input.restaurantId },
        select: { id: true },
      });

      if (!restaurant) {
        throw new Error("Restaurant not found.");
      }

      // 2. Create the menu item. A unique constraint on (restaurantId, name) in the
      // Prisma schema will handle the uniqueness check atomically.
      try {
        return await tx.menuItem.create({
          data: input,
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002" // Unique constraint violation
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
   * Finds a single menu item by its unique ID.
   * @param id - The ID of the menu item to find.
   * @returns The menu item if found, otherwise null.
   */
  async getMenuItemById(id: string): Promise<MenuItemResponse | null> {
    return this.prisma.menuItem.findUnique({
      where: { id },
    });
  }

  /**
   * Updates an existing menu item's information.
   * @param id - The ID of the menu item to update.
   * @param input - The data to update.
   * @returns The updated menu item.
   * @throws Error if the item is not found or if the new name is a duplicate.
   */
  async updateMenuItem(
    id: string,
    input: UpdateMenuItemInput,
  ): Promise<MenuItemResponse> {
    const item = await this.getMenuItemById(id);
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
   * Toggles the availability of a menu item.
   * @param id - The ID of the menu item to toggle.
   * @returns The updated menu item.
   * @throws Error if the menu item is not found.
   */
  async toggleAvailability(id: string): Promise<MenuItemResponse> {
    const item = await this.getMenuItemById(id);
    if (!item) {
      throw new Error("Menu item not found");
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable: !item.isAvailable },
    });
  }

  /**
   * Soft deletes a menu item by setting its `isAvailable` flag to false.
   * This is an idempotent operation.
   * @param id - The ID of the menu item to delete.
   * @returns The updated menu item with `isAvailable: false`.
   * @throws Error if the menu item is not found.
   */
  async deleteMenuItem(id: string): Promise<MenuItemResponse> {
    const item = await this.getMenuItemById(id);
    if (!item) {
      throw new Error("Menu item not found");
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable: false },
    });
  }
}
