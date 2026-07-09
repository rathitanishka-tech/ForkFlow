import { z } from "zod";

export const createFloorSchema = z.object({
  restaurantId: z.string().uuid("Invalid restaurant ID"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  level: z
    .number()
    .int()
    .min(-5, "Level must be at least -5")
    .max(100, "Level cannot exceed 100"),
  width: z.number().positive().max(10000),
  height: z.number().positive().max(10000),
  isActive: z.boolean().default(true),
});

export type CreateFloorInput = z.infer<typeof createFloorSchema>;

export const updateFloorSchema = createFloorSchema.partial();

export type UpdateFloorInput = z.infer<typeof updateFloorSchema>;
