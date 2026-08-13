import { Prisma, PrismaClient } from "@prisma/client";
import { FloorFilters, FloorListResponse, FloorResponse } from "./floor.types";
import { CreateFloorInput, UpdateFloorInput } from "./floor.validator";

export class FloorService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Creates a new floor for a given restaurant.
   * It ensures the parent restaurant exists and the floor level is unique within that restaurant.
   * @param input - The data for the new floor (restaurantId is server-resolved).
   * @returns The newly created floor.
   * @throws Error if the restaurant is not found or if the level is a duplicate.
   */
  async createFloor(input: CreateFloorInput): Promise<FloorResponse> {
    return this.prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.findUnique({
        where: { id: input.restaurantId },
        select: { id: true },
      });

      if (!restaurant) {
        throw new Error("Restaurant not found");
      }

      try {
        return await tx.floor.create({
          data: input,
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new Error(
            "A floor with this level already exists for this restaurant.",
          );
        }
        throw error;
      }
    });
  }

  /**
   * Retrieves a paginated and filtered list of floors.
   * @param filters - The filtering and pagination criteria.
   * @returns A paginated list of floors and the total count.
   */
  async getFloors(filters: FloorFilters = {}): Promise<FloorListResponse> {
    const { restaurantId, isActive, search, page = 1, limit = 10 } = filters;

    const where: Prisma.FloorWhereInput = {
      restaurantId,
      isActive,
    };

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [floors, total] = await this.prisma.$transaction([
      this.prisma.floor.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { level: "asc" },
      }),
      this.prisma.floor.count({ where }),
    ]);

    return {
      data: floors,
      total,
      page,
      limit,
    };
  }

  /**
   * Finds a single floor by its unique ID, scoped to the given restaurant.
   * @param id - The ID of the floor to find.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The floor if found and owned by the restaurant, otherwise null.
   */
  async getFloorById(
    id: string,
    restaurantId: string,
  ): Promise<FloorResponse | null> {
    return this.prisma.floor.findFirst({
      where: { id, restaurantId },
    });
  }

  /**
   * Updates an existing floor's information, scoped to the given restaurant.
   * @param id - The ID of the floor to update.
   * @param input - The data to update.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated floor.
   * @throws Error if the floor is not found or if the new level is a duplicate.
   */
  async updateFloor(
    id: string,
    input: UpdateFloorInput,
    restaurantId: string,
  ): Promise<FloorResponse> {
    const floor = await this.getFloorById(id, restaurantId);
    if (!floor) {
      throw new Error("Floor not found");
    }

    try {
      return await this.prisma.floor.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error(
          "A floor with this level already exists for this restaurant.",
        );
      }
      throw error;
    }
  }

  /**
   * Soft deletes a floor by setting its `isActive` flag to false, scoped to the given restaurant.
   * @param id - The ID of the floor to delete.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated floor with `isActive: false`.
   * @throws Error if the floor is not found.
   */
  async deleteFloor(id: string, restaurantId: string): Promise<FloorResponse> {
    const floor = await this.getFloorById(id, restaurantId);
    if (!floor) {
      throw new Error("Floor not found");
    }

    return this.prisma.floor.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
