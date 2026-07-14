import type { MenuItem } from "@prisma/client";

/**
 * Represents a menu item recommended to the user.
 * It includes essential details for display.
 */
export type RecommendedMenuItem = Pick<
  MenuItem,
  "id" | "name" | "price" | "image"
>;
