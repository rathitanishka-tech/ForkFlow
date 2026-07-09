import { MenuService } from "./menu.service";
import { MenuFilters, MenuItemResponse, MenuListResponse } from "./menu.types";
import { createMenuItemSchema, updateMenuItemSchema } from "./menu.validator";

/**
 * The controller is responsible for handling incoming request data,
 * validating it, and passing it to the service layer for business logic execution.
 * It remains agnostic to the transport layer (e.g., HTTP).
 */
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * Validates and creates a new menu item.
   * @param body - The raw request body.
   * @returns The created menu item.
   */
  async create(body: unknown): Promise<MenuItemResponse> {
    const input = createMenuItemSchema.parse(body);
    return this.menuService.createMenuItem(input);
  }

  /**
   * Retrieves a list of menu items based on filter criteria.
   * @param query - The filter and pagination parameters.
   * @returns A paginated list of menu items.
   */
  async list(query: MenuFilters): Promise<MenuListResponse> {
    // For production-grade code, consider adding Zod validation for query params.
    return this.menuService.getMenuItems(query);
  }

  /**
   * Retrieves a single menu item by its ID.
   * @param id - The unique identifier of the menu item.
   * @returns The menu item, or null if not found.
   */
  async getById(id: string): Promise<MenuItemResponse | null> {
    return this.menuService.getMenuItemById(id);
  }

  /**
   * Validates and updates an existing menu item.
   * @param id - The ID of the menu item to update.
   * @param body - The raw request body containing update data.
   * @returns The updated menu item.
   */
  async update(id: string, body: unknown): Promise<MenuItemResponse> {
    const input = updateMenuItemSchema.parse(body);
    return this.menuService.updateMenuItem(id, input);
  }

  /**
   * Soft-deletes a menu item.
   * @param id - The ID of the menu item to delete.
   * @returns The updated menu item.
   */
  async delete(id: string): Promise<MenuItemResponse> {
    return this.menuService.deleteMenuItem(id);
  }

  /**
   * Toggles the availability of a menu item.
   * @param id - The ID of the menu item to toggle.
   * @returns The updated menu item.
   */
  async toggleAvailability(id: string): Promise<MenuItemResponse> {
    return this.menuService.toggleAvailability(id);
  }
}
