import { MenuService } from "./menu.service";
import { MenuFilters, MenuItemResponse, MenuListResponse } from "./menu.types";
import { createMenuItemSchema, updateMenuItemSchema } from "./menu.validator";

/**
 * The controller is responsible for handling incoming request data,
 * validating it, and passing it to the service layer for business logic execution.
 * It remains agnostic to the transport layer (e.g., HTTP).
 *
 * All methods that create a menu item receive the server-resolved restaurantId
 * to enforce data isolation.
 */
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * Validates and creates a new menu item.
   * The restaurantId is injected server-side; any client-supplied value is ignored.
   * @param body - The raw request body (restaurantId will be overridden).
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The created menu item.
   */
  async create(body: unknown, restaurantId: string): Promise<MenuItemResponse> {
    const input = createMenuItemSchema.parse(body);
    return this.menuService.createMenuItem({ ...input, restaurantId });
  }

  /**
   * Retrieves a list of menu items based on filter criteria.
   * @param query - The filter and pagination parameters.
   * @returns A paginated list of menu items.
   */
  async list(query: MenuFilters): Promise<MenuListResponse> {
    return this.menuService.getMenuItems(query);
  }

  /**
   * Retrieves a single menu item by its ID, scoped to the given restaurant.
   * @param id - The unique identifier of the menu item.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The menu item, or null if not found or not owned by the restaurant.
   */
  async getById(
    id: string,
    restaurantId: string,
  ): Promise<MenuItemResponse | null> {
    return this.menuService.getMenuItemById(id, restaurantId);
  }

  /**
   * Validates and updates an existing menu item, scoped to the given restaurant.
   * @param id - The ID of the menu item to update.
   * @param body - The raw request body containing update data.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated menu item.
   */
  async update(
    id: string,
    body: unknown,
    restaurantId: string,
  ): Promise<MenuItemResponse> {
    const input = updateMenuItemSchema.parse(body);
    return this.menuService.updateMenuItem(id, input, restaurantId);
  }

  /**
   * Soft-deletes a menu item, scoped to the given restaurant.
   * @param id - The ID of the menu item to delete.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated menu item.
   */
  async delete(id: string, restaurantId: string): Promise<MenuItemResponse> {
    return this.menuService.deleteMenuItem(id, restaurantId);
  }

  /**
   * Toggles the availability of a menu item, scoped to the given restaurant.
   * @param id - The ID of the menu item to toggle.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated menu item.
   */
  async toggleAvailability(
    id: string,
    restaurantId: string,
  ): Promise<MenuItemResponse> {
    return this.menuService.toggleAvailability(id, restaurantId);
  }
}
