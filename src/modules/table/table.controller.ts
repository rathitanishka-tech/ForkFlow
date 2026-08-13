import { TableService } from "./table.service";
import { TableFilters, TableListResponse, TableResponse } from "./table.types";
import {
  bulkCreateTableSchema,
  createTableSchema,
  updateTablePositionSchema,
  updateTableSchema,
  updateTableStatusSchema,
} from "./table.validator";

/**
 * The controller is responsible for handling incoming request data,
 * validating it, and passing it to the service layer for business logic execution.
 * It remains agnostic to the transport layer (e.g., HTTP).
 *
 * All methods that create or access a specific table receive the
 * server-resolved restaurantId to enforce data isolation.
 */
export class TableController {
  constructor(private readonly tableService: TableService) {}

  /**
   * Validates and creates a new table.
   * The restaurantId is injected server-side; the floor ownership is verified.
   * @param body - The raw request body.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The created table.
   */
  async create(body: unknown, restaurantId: string): Promise<TableResponse> {
    const input = createTableSchema.parse(body);
    return this.tableService.createTable(input, restaurantId);
  }

  /**
   * Validates and creates multiple tables in a single operation.
   * @param body - The raw request body, expected to contain a 'tables' array.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The count of created tables.
   */
  async bulkCreate(
    body: unknown,
    restaurantId: string,
  ): Promise<{ count: number }> {
    const input = bulkCreateTableSchema.parse(body);
    return this.tableService.bulkCreateTables(input, restaurantId);
  }

  /**
   * Retrieves a list of tables based on filter criteria.
   * @param query - The filter and pagination parameters.
   * @returns A paginated list of tables.
   */
  async list(query: TableFilters): Promise<TableListResponse> {
    return this.tableService.getTables(query);
  }

  /**
   * Retrieves a single table by its ID, scoped to the given restaurant.
   * @param id - The unique identifier of the table.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The table, or null if not found or not owned by the restaurant.
   */
  async getById(
    id: string,
    restaurantId: string,
  ): Promise<TableResponse | null> {
    return this.tableService.getTableById(id, restaurantId);
  }

  /**
   * Validates and updates an existing table's general information, scoped to the given restaurant.
   * @param id - The ID of the table to update.
   * @param body - The raw request body containing update data.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated table.
   */
  async update(
    id: string,
    body: unknown,
    restaurantId: string,
  ): Promise<TableResponse> {
    const input = updateTableSchema.parse(body);
    return this.tableService.updateTable(id, input, restaurantId);
  }

  /**
   * Validates and updates a table's position, scoped to the given restaurant.
   * @param id - The ID of the table to update.
   * @param body - The raw request body with position data.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated table.
   */
  async updatePosition(
    id: string,
    body: unknown,
    restaurantId: string,
  ): Promise<TableResponse> {
    const input = updateTablePositionSchema.parse(body);
    return this.tableService.updateTablePosition(id, input, restaurantId);
  }

  /**
   * Validates and updates a table's status, scoped to the given restaurant.
   * @param id - The ID of the table to update.
   * @param body - The raw request body with status data.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The updated table.
   */
  async updateStatus(
    id: string,
    body: unknown,
    restaurantId: string,
  ): Promise<TableResponse> {
    const input = updateTableStatusSchema.parse(body);
    return this.tableService.updateTableStatus(id, input, restaurantId);
  }

  /**
   * Soft-deletes a table, scoped to the given restaurant.
   * @param id - The ID of the table to delete.
   * @param restaurantId - The server-resolved restaurant ID.
   * @returns The table with its `isActive` status set to false.
   */
  async delete(id: string, restaurantId: string): Promise<TableResponse> {
    return this.tableService.deleteTable(id, restaurantId);
  }
}
