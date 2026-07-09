import { TableShape, TableStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schema for creating a single table.
 */
export const createTableSchema = z.object({
  floorId: z.string().uuid("Invalid floor ID"),
  number: z
    .string()
    .trim()
    .min(1, "Table number must be at least 1 character")
    .max(10, "Table number cannot exceed 10 characters"),
  capacity: z
    .number()
    .int()
    .min(1, "Capacity must be at least 1")
    .max(20, "Capacity cannot exceed 20"),
  shape: z.nativeEnum(TableShape),
  status: z.nativeEnum(TableStatus).default(TableStatus.AVAILABLE),
  xPosition: z.number(),
  yPosition: z.number(),
  rotation: z
    .number()
    .min(0, "Rotation must be at least 0")
    .max(360, "Rotation cannot exceed 360")
    .default(0),
  isActive: z.boolean().default(true),
});

export type CreateTableInput = z.infer<typeof createTableSchema>;

/**
 * Schema for updating a table with any of its properties.
 */
export const updateTableSchema = createTableSchema
  .omit({
    floorId: true,
  })
  .partial();

export type UpdateTableInput = z.infer<typeof updateTableSchema>;

/**
 * Schema for creating multiple tables in a single request.
 */
export const bulkCreateTableSchema = z.object({
  tables: z.array(createTableSchema).min(1),
});

/**
 * Schema specifically for updating a table's position and rotation.
 */
export const updateTablePositionSchema = z.object({
  xPosition: z.number(),
  yPosition: z.number(),
  rotation: z.number().min(0).max(360),
});

/**
 * Schema specifically for updating a table's status.
 */
export const updateTableStatusSchema = createTableSchema.pick({ status: true });
