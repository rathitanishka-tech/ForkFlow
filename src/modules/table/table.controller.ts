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
 */
export class TableController {
  constructor(private readonly tableService: TableService) {}

  /**
   * Validates and creates a new table.
   * @param body - The raw request body.
   * @returns The created table.
   */
  async create(body: unknown): Promise<TableResponse> {
    const input = createTableSchema.parse(body);
    return this.tableService.createTable(input);
  }

  /**
   * Validates and creates multiple tables in a single operation.
   * @param body - The raw request body, expected to contain a 'tables' array.
   * @returns The count of created tables.
   */
  async bulkCreate(body: unknown): Promise<{ count: number }> {
    const input = bulkCreateTableSchema.parse(body);
    return this.tableService.bulkCreateTables(input);
  }

  /**
   * Retrieves a list of tables based on filter criteria.
   * @param query - The filter and pagination parameters.
   * @returns A paginated list of tables.
   */
  async list(query: TableFilters): Promise<TableListResponse> {
    // For production-grade code, consider adding Zod validation for query params.
    return this.tableService.getTables(query);
  }

  /**
   * Retrieves a single table by its ID.
   * @param id - The unique identifier of the table.
   * @returns The table, or null if not found.
   */
  async getById(id: string): Promise<TableResponse | null> {
    return this.tableService.getTableById(id);
  }

  /**
   * Validates and updates an existing table's general information.
   * @param id - The ID of the table to update.
   * @param body - The raw request body containing update data.
   * @returns The updated table.
   */
  async update(id: string, body: unknown): Promise<TableResponse> {
    const input = updateTableSchema.parse(body);
    return this.tableService.updateTable(id, input);
  }

  /**
   * Validates and updates a table's position.
   * @param id - The ID of the table to update.
   * @param body - The raw request body with position data.
   * @returns The updated table.
   */
  async updatePosition(id: string, body: unknown): Promise<TableResponse> {
    const input = updateTablePositionSchema.parse(body);
    return this.tableService.updateTablePosition(id, input);
  }

  /**
   * Validates and updates a table's status.
   * @param id - The ID of the table to update.
   * @param body - The raw request body with status data.
   * @returns The updated table.
   */
  async updateStatus(id: string, body: unknown): Promise<TableResponse> {
    const input = updateTableStatusSchema.parse(body);
    return this.tableService.updateTableStatus(id, input);
  }

  /**
   * Soft-deletes a table.
   * @param id - The ID of the table to delete.
   * @returns The table with its `isActive` status set to false.
   */
  async delete(id: string): Promise<TableResponse> {
    return this.tableService.deleteTable(id);
  }
}
