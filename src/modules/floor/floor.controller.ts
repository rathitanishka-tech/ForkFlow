import { FloorService } from "./floor.service";
import { FloorFilters, FloorListResponse, FloorResponse } from "./floor.types";
import { createFloorSchema, updateFloorSchema } from "./floor.validator";

/**
 * The controller is responsible for handling incoming request data,
 * validating it, and passing it to the service layer for business logic execution.
 * It remains agnostic to the transport layer (e.g., HTTP).
 *
 * All methods that access a specific floor or create a floor receive the
 * server-resolved restaurantId to enforce data isolation.
 */
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  /**
   * Validates and creates a new floor.
   * The restaurantId is injected server-side; any client-supplied value is ignored.
   * @param body - The raw request body (restaurantId will be overridden).
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The created floor.
   */
  async create(body: unknown, restaurantId: string): Promise<FloorResponse> {
    const input = createFloorSchema.parse(body);
    return this.floorService.createFloor({ ...input, restaurantId });
  }

  /**
   * Retrieves a list of floors based on filter criteria.
   * @param query - The filter and pagination parameters.
   * @returns A paginated list of floors.
   */
  async list(query: FloorFilters): Promise<FloorListResponse> {
    return this.floorService.getFloors(query);
  }

  /**
   * Retrieves a single floor by its ID, scoped to the given restaurant.
   * @param id - The unique identifier of the floor.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The floor, or null if not found or not owned by the restaurant.
   */
  async getById(
    id: string,
    restaurantId: string,
  ): Promise<FloorResponse | null> {
    return this.floorService.getFloorById(id, restaurantId);
  }

  /**
   * Validates and updates an existing floor, scoped to the given restaurant.
   * @param id - The ID of the floor to update.
   * @param body - The raw request body containing update data.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated floor.
   */
  async update(
    id: string,
    body: unknown,
    restaurantId: string,
  ): Promise<FloorResponse> {
    const input = updateFloorSchema.parse(body);
    return this.floorService.updateFloor(id, input, restaurantId);
  }

  /**
   * Soft-deletes a floor, scoped to the given restaurant.
   * @param id - The ID of the floor to delete.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The floor with its `isActive` status set to false.
   */
  async delete(id: string, restaurantId: string): Promise<FloorResponse> {
    return this.floorService.deleteFloor(id, restaurantId);
  }
}
