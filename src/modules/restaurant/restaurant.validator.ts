import { z } from "zod";

export const propertyTypeSchema = z.enum(["OWNED", "LEASED", "RENTED"]);

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number");

export const createRestaurantSchema = z.object({
  businessId: z.string().uuid("Invalid business ID"),
  name: z.string().trim().min(2).max(100),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens.",
    ),
  description: z.string().trim().optional(),
  phone: phoneSchema.optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .optional(),
  address: z.string().trim().optional(),
  propertyType: propertyTypeSchema,
  timezone: z.string().trim().min(1),
  currency: z.string().trim().min(1),
  parkingAvailable: z.boolean(),
  isActive: z.boolean().default(true),
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;

export const updateRestaurantSchema = createRestaurantSchema.partial();

export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;

export const restaurantFiltersSchema = z.object({
  businessId: z.string().uuid("Invalid business ID").optional(),
  isActive: z.boolean().optional(),
  propertyType: propertyTypeSchema.optional(),
  search: z.string().trim().optional(),
});

export type RestaurantFiltersInput = z.infer<typeof restaurantFiltersSchema>;
