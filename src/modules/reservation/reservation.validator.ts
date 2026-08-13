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
  reservationTime: z.coerce.date(),
  partySize: z.number().int().min(1),
  occasion: z.string().trim().optional(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const updateReservationSchema = z.object({
  tableId: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(100).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number")
    .optional(),
  email: z.string().email().optional(),
  reservationTime: z.coerce.date().optional(),
  partySize: z.number().int().min(1).optional(),
  occasion: z.string().trim().optional(),
});

export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
