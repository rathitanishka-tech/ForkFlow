import { z } from "zod";

export const recommendTableSchema = z.object({
  restaurantId: z.string().uuid("Invalid restaurant ID"),
  partySize: z
    .number()
    .int()
    .min(1, "Party size must be at least 1")
    .max(20, "Party size cannot exceed 20"),
  occasion: z
    .enum(["Birthday", "Anniversary", "Business", "Family", "Date", "Friends"])
    .optional(),
  seatingPreference: z.enum(["WINDOW", "INDOOR", "OUTDOOR", "BAR"]).optional(),
  noisePreference: z.enum(["QUIET", "NORMAL", "LIVELY"]).optional(),
});

export type RecommendTableInput = z.infer<typeof recommendTableSchema>;
