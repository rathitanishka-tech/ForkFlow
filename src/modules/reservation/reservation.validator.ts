import { z } from "zod";

export const createReservationSchema = z.object({
  restaurantId: z.string().uuid(),
  tableId: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number"),
  email: z.string().email().optional(),
  reservationDate: z.coerce.date(),
  guests: z.number().int().min(1),
  occasion: z.string().trim().optional(),
  seatingPreference: z.string().trim().optional(),
  noisePreference: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
