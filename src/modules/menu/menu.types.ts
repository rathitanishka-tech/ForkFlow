/**
 * Represents the spice level of a menu item.
 * This is decoupled from the database layer.
 */
export type SpiceLevel = "NONE" | "MILD" | "MEDIUM" | "HOT" | "VERY_HOT";

/**
 * Detailed response model for a single menu item.
 */
export interface MenuItemResponse {
  id: string;
  restaurantId: string;
  category: string;
  name: string;
  description: string | null;
  price: number;
  preparationTime: number;
  image: string | null;
  isAvailable: boolean;
  isVeg: boolean;
  spiceLevel: SpiceLevel;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * A summarized version of a menu item, suitable for list views.
 */
export interface MenuItemSummary {
  id: string;
  category: string;
  name: string;
  price: number;
  image: string | null;
  isAvailable: boolean;
  isVeg: boolean;
  spiceLevel: SpiceLevel;
}

/**
 * Detailed response model for a single menu category.
 */
export interface MenuCategoryResponse {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Defines the available filters for querying a list of menu items.
 */
export interface MenuFilters {
  restaurantId?: string;
  category?: string;
  isAvailable?: boolean;
  isVeg?: boolean;
  spiceLevel?: SpiceLevel;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * A paginated response structure for a list of menu items.
 */
export interface MenuListResponse {
  data: MenuItemSummary[];
  total: number;
  page: number;
  limit: number;
}

/**
 * High-level statistics for a restaurant's menu.
 */
export interface MenuMetrics {
  totalItems: number;
  availableItems: number;
  vegItems: number;
  nonVegItems: number;
  averagePreparationTime: number;
}
