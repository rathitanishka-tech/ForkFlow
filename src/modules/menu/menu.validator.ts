import { z } from "zod";

/**
 * Defines the available spice levels for a menu item.
 */
export const spiceLevelEnum = z.enum([
  "NONE",
  "MILD",
  "MEDIUM",
  "HOT",
  "VERY_HOT",
]);

/**
 * Schema for creating a new menu item.
 */
export const createMenuItemSchema = z.object({
  restaurantId: z.string().uuid("Invalid restaurant ID"),
  category: z.string().trim().min(2).max(50),
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional(),
  price: z.number().positive("Price must be a positive number"),
  preparationTime: z
    .number()
    .int()
    .min(1, "Preparation time must be at least 1 minute")
    .max(180, "Preparation time cannot exceed 180 minutes"),
  image: z.string().url("Invalid image URL").optional(),
  isAvailable: z.boolean().default(true),
  isVeg: z.boolean(),
  spiceLevel: spiceLevelEnum,
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;

/**
 * Schema for updating an existing menu item. All fields are optional.
 */
export const updateMenuItemSchema = createMenuItemSchema
  .omit({
    restaurantId: true,
  })
  .partial();

export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
