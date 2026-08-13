/**
 * Represents the shape of a table.
 * This is decoupled from the database layer by using a string literal type.
 */
export type TableShape =
  | "ROUND"
  | "SQUARE"
  | "RECTANGLE"
  | "SOFA"
  | "BAR"
  | "OUTDOOR";

/**
 * Represents the current status of a table.
 * This is decoupled from the database layer.
 */
export type TableStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "OCCUPIED"
  | "MAINTENANCE"
  | "UNAVAILABLE";

/**
 * Detailed response model for a single table.
 * Includes all public-facing fields.
 */
export interface TableResponse {
  id: string;
  floorId: string;
  number: string;
  capacity: number;
  shape: TableShape;
  status: TableStatus;
  xPosition: number;
  yPosition: number;
  rotation: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * A summarized version of a table, suitable for list views.
 */
export interface TableSummary {
  id: string;
  number: string;
  capacity: number;
  shape: TableShape;
  status: TableStatus;
  isActive: boolean;
}

/**
 * Defines the available filters for querying a list of tables.
 */
export interface TableFilters {
  restaurantId?: string;
  floorId?: string;
  status?: TableStatus;
  shape?: TableShape;
  isActive?: boolean;
  minCapacity?: number;
  maxCapacity?: number;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * A paginated response structure for a list of tables.
 */
export interface TableListResponse {
  data: TableSummary[];
  total: number;
  page: number;
  limit: number;
}

/**
 * High-level statistics for all tables on a floor or in a restaurant.
 */
export interface TableMetrics {
  totalTables: number;
  availableTables: number;
  occupiedTables: number;
  reservedTables: number;
  maintenanceTables: number;
}

/**
 * Data structure representing a table's visual layout on a floor plan.
 */
export interface TableLayout {
  id: string;
  restaurantId?: string;
  number: string;
  capacity: number;
  shape: TableShape;
  status: TableStatus;
  xPosition: number;
  yPosition: number;
  rotation: number;
}
