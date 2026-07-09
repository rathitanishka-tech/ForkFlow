import { FloorService } from "./floor.service";
import { FloorFilters, FloorListResponse, FloorResponse } from "./floor.types";
import { createFloorSchema, updateFloorSchema } from "./floor.validator";

/**
 * The controller is responsible for handling incoming request data,
 * validating it, and passing it to the service layer for business logic execution.
 * It remains agnostic to the transport layer (e.g., HTTP).
 */
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  /**
   * Validates and creates a new floor.
   * @param body - The raw request body.
   * @returns The created floor.
   */
  async create(body: unknown): Promise<FloorResponse> {
    const input = createFloorSchema.parse(body);
    return this.floorService.createFloor(input);
  }

  /**
   * Retrieves a list of floors based on filter criteria.
   * @param query - The filter and pagination parameters.
   * @returns A paginated list of floors.
   */
  async list(query: FloorFilters): Promise<FloorListResponse> {
    // For production-grade code, consider adding Zod validation for query params.
    return this.floorService.getFloors(query);
  }

  /**
   * Retrieves a single floor by its ID.
   * @param id - The unique identifier of the floor.
   * @returns The floor, or null if not found.
   */
  async getById(id: string): Promise<FloorResponse | null> {
    return this.floorService.getFloorById(id);
  }

  /**
   * Validates and updates an existing floor.
   * @param id - The ID of the floor to update.
   * @param body - The raw request body containing update data.
   * @returns The updated floor.
   */
  async update(id: string, body: unknown): Promise<FloorResponse> {
    const input = updateFloorSchema.parse(body);
    return this.floorService.updateFloor(id, input);
  }

  /**
   * Soft-deletes a floor.
   * @param id - The ID of the floor to delete.
   * @returns The floor with its `isActive` status set to false.
   */
  async delete(id: string): Promise<FloorResponse> {
    return this.floorService.deleteFloor(id);
  }
}
