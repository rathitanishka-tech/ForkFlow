export type PropertyType = "OWNED" | "LEASED" | "RENTED";

export interface RestaurantResponse {
  id: string;
  businessId: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  propertyType: PropertyType;
  timezone: string;
  currency: string;
  parkingAvailable: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RestaurantSummary {
  id: string;
  businessId: string;
  name: string;
  slug: string;
  propertyType: PropertyType;
  isActive: boolean;
}

export interface RestaurantFilters {
  businessId?: string;
  isActive?: boolean;
  propertyType?: PropertyType;
  search?: string;
}

export interface RestaurantStats {
  totalRestaurants: number;
  activeRestaurants: number;
  inactiveRestaurants: number;
  restaurantsByPropertyType: Record<PropertyType, number>;
}

export interface RestaurantMetrics {
  totalReservations: number;
  occupiedTables: number;
  availableTables: number;
  todayRevenue: number;
  averageRating: number;
}

export interface RestaurantDashboardCard {
  id: string;
  name: string;
  activeTables: number;
  todayReservations: number;
  occupancyRate: number;
}

export interface RestaurantListResponse {
  restaurants: RestaurantSummary[];
  total: number;
}
