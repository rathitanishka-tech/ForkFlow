import { RestaurantService } from "./restaurant.service";
import {
  RestaurantFilters,
  RestaurantListResponse,
  RestaurantResponse,
} from "./restaurant.types";
import {
  createRestaurantSchema,
  restaurantFiltersSchema,
  updateRestaurantSchema,
} from "./restaurant.validator";

export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  async create(body: unknown): Promise<RestaurantResponse> {
    const input = createRestaurantSchema.parse(body);
    return this.restaurantService.createRestaurant(input);
  }

  async list(query: RestaurantFilters): Promise<RestaurantListResponse> {
    const filters = restaurantFiltersSchema.parse(query);
    return this.restaurantService.getRestaurants(filters);
  }

  async getById(id: string): Promise<RestaurantResponse | null> {
    return this.restaurantService.getRestaurantById(id);
  }

  async update(id: string, body: unknown): Promise<RestaurantResponse> {
    const input = updateRestaurantSchema.parse(body);
    return this.restaurantService.updateRestaurant(id, input);
  }

  async delete(id: string): Promise<RestaurantResponse> {
    return this.restaurantService.deleteRestaurant(id);
  }
}
