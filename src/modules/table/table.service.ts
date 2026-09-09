import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";
import { TableFilters, TableListResponse, TableResponse } from "./table.types";
import {
  CreateTableInput,
  UpdateTableInput,
  updateTablePositionSchema,
  updateTableStatusSchema,
} from "./table.validator";

export class TableService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Creates a new table on a given floor.
   * It ensures the parent floor exists and belongs to the given restaurant,
   * and that the table number is unique on that floor.
   * @param input - The data for the new table.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The newly created table.
   * @throws Error if the floor is not found or doesn't belong to the restaurant,
   *         or if the table number is a duplicate.
   */
  async createTable(
    input: CreateTableInput,
    restaurantId: string,
  ): Promise<TableResponse> {
    return this.prisma.$transaction(async (tx) => {
      const floor = await tx.floor.findFirst({
        where: { id: input.floorId, restaurantId },
        select: { id: true },
      });

      if (!floor) {
        throw new Error("Floor not found");
      }

      try {
        return await tx.table.create({
          data: input,
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new Error(
            `A table with number "${input.number}" already exists on this floor.`,
          );
        }
        throw error;
      }
    });
  }

  /**
   * Creates multiple tables in a single atomic transaction.
   * If any table fails validation (e.g., duplicate number), the entire operation is rolled back.
   * @param input - An object containing an array of tables to create.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The number of tables created.
   * @throws Error if any specified floor is not found or doesn't belong to the restaurant,
   *         or if any table number is a duplicate.
   */
  async bulkCreateTables(
    input: { tables: CreateTableInput[] },
    restaurantId: string,
  ): Promise<{ count: number }> {
    return this.prisma.$transaction(async (tx) => {
      const floorIds = [...new Set(input.tables.map((t) => t.floorId))];
      const floors = await tx.floor.findMany({
        where: { id: { in: floorIds }, restaurantId },
        select: { id: true },
      });

      if (floors.length !== floorIds.length) {
        throw new Error("One or more specified floors do not exist.");
      }

      try {
        const result = await tx.table.createMany({
          data: input.tables,
        });
        return result;
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new Error(
            "Bulk creation failed: one or more tables have a number that already exists on its floor.",
          );
        }
        throw error;
      }
    });
  }

  /**
   * Retrieves a paginated and filtered list of tables.
   * @param filters - The filtering and pagination criteria.
   * @returns A paginated list of tables and the total count.
   */
  async getTables(filters: TableFilters = {}): Promise<TableListResponse> {
    const {
      restaurantId,
      floorId,
      status,
      shape,
      isActive,
      search,
      minCapacity,
      maxCapacity,
      page = 1,
      limit = 10,
    } = filters;

    const where: Prisma.TableWhereInput = {
      floorId,
      status,
      shape,
      isActive,
      floor: restaurantId ? { restaurantId } : undefined,
    };

    if (search) {
      where.number = { contains: search, mode: "insensitive" };
    }

    if (minCapacity || maxCapacity) {
      where.capacity = {};
      if (minCapacity) where.capacity.gte = minCapacity;
      if (maxCapacity) where.capacity.lte = maxCapacity;
    }

    const [tables, total] = await this.prisma.$transaction([
      this.prisma.table.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { number: "asc" },
      }),
      this.prisma.table.count({ where }),
    ]);

    return { data: tables, total, page, limit };
  }

  /**
   * Finds a single table by its unique ID, scoped to the given restaurant
   * via its floor relationship.
   * @param id - The ID of the table to find.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The table if found and owned by the restaurant, otherwise null.
   */
  async getTableById(
    id: string,
    restaurantId: string,
  ): Promise<TableResponse | null> {
    return this.prisma.table.findFirst({
      where: {
        id,
        floor: { restaurantId },
      },
    });
  }

  /**
   * Updates an existing table's information, scoped to the given restaurant.
   * @param id - The ID of the table to update.
   * @param input - The data to update.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated table.
   * @throws Error if the table is not found or if the new number is a duplicate.
   */
  async updateTable(
    id: string,
    input: UpdateTableInput,
    restaurantId: string,
  ): Promise<TableResponse> {
    const table = await this.getTableById(id, restaurantId);
    if (!table) {
      throw new Error("Table not found");
    }

    try {
      return await this.prisma.table.update({ where: { id }, data: input });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error(
          `A table with number "${input.number}" already exists on this floor.`,
        );
      }
      throw error;
    }
  }

  /**
   * Updates a table's position and rotation, scoped to the given restaurant.
   * @param id - The ID of the table to update.
   * @param input - The new position data.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated table.
   */
  async updateTablePosition(
    id: string,
    input: z.infer<typeof updateTablePositionSchema>,
    restaurantId: string,
  ): Promise<TableResponse> {
    const table = await this.getTableById(id, restaurantId);
    if (!table) {
      throw new Error("Table not found");
    }

    return this.prisma.table.update({ where: { id }, data: input });
  }

  /**
   * Updates a table's status, scoped to the given restaurant.
   * @param id - The ID of the table to update.
   * @param input - The new status.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated table.
   */
  async updateTableStatus(
    id: string,
    input: z.infer<typeof updateTableStatusSchema>,
    restaurantId: string,
  ): Promise<TableResponse> {
    const table = await this.getTableById(id, restaurantId);
    if (!table) {
      throw new Error("Table not found");
    }

    return this.prisma.table.update({ where: { id }, data: input });
  }

  /**
   * Soft deletes a table by setting its `isActive` flag to false, scoped to the given restaurant.
   * @param id - The ID of the table to delete.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated table with `isActive: false`.
   * @throws Error if the table is not found.
   */
  async deleteTable(id: string, restaurantId: string): Promise<TableResponse> {
    const table = await this.getTableById(id, restaurantId);
    if (!table) {
      throw new Error("Table not found");
    }

    // Check for active business data
    const activeData = await this.prisma.table.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            diningSessions: { where: { status: "ACTIVE" } },
            reservations: {
              where: { status: { in: ["PENDING", "CONFIRMED", "SEATED"] } },
            },
            orders: {
              where: { status: { in: ["PENDING", "PREPARING", "READY", "SERVED"] } },
            },
          },
        },
      },
    });

    if (
      activeData &&
      (activeData._count.diningSessions > 0 ||
        activeData._count.reservations > 0 ||
        activeData._count.orders > 0)
    ) {
      throw new Error(
        "This table currently has active activity and cannot be removed.",
      );
    }

    return this.prisma.table.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
