/**
 * Detailed response model for a single floor plan.
 * Includes all public-facing fields.
 */
export interface FloorResponse {
  id: string;
  restaurantId: string;
  name: string;
  level: number;
  width: number;
  height: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * A summarized version of a floor, suitable for list views or navigation.
 */
export interface FloorSummary {
  id: string;
  name: string;
  level: number;
  isActive: boolean;
}

/**
 * Defines the available filters for querying a list of floors.
 */
export interface FloorFilters {
  restaurantId?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * A paginated response structure for a list of floors.
 */
export interface FloorListResponse {
  data: FloorSummary[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Key performance indicators and metrics for a single floor.
 * Useful for operational dashboards.
 */
export interface FloorMetrics {
  id: string;
  totalTables: number;
  occupiedTables: number;
  availableTables: number;
  occupancyRate: number;
}
