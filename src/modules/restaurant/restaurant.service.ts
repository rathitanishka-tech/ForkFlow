import { Prisma, PrismaClient } from "@prisma/client";

import {
  RestaurantFilters,
  RestaurantListResponse,
  RestaurantResponse,
} from "./restaurant.types";
import {
  CreateRestaurantInput,
  UpdateRestaurantInput,
} from "./restaurant.validator";

export class RestaurantService {
  constructor(private readonly prisma: PrismaClient) {}

  async createRestaurant(
    input: CreateRestaurantInput,
  ): Promise<RestaurantResponse> {
    return this.prisma.$transaction(async (tx) => {
      await this.ensureBusinessExists(input.businessId, tx);
      await this.ensureSlugIsAvailable(input.businessId, input.slug, undefined, tx);

      return tx.restaurant.create({
        data: input,
      });
    });
  }

  async getRestaurants(
    filters: RestaurantFilters = {},
  ): Promise<RestaurantListResponse> {
    const { businessId, isActive, propertyType, search } = filters;
    const where: Prisma.RestaurantWhereInput = {
      businessId,
      isActive,
      propertyType,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    const [restaurants, total] = await this.prisma.$transaction([
      this.prisma.restaurant.findMany({
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          businessId: true,
          name: true,
          slug: true,
          propertyType: true,
          isActive: true,
        },
      }),
      this.prisma.restaurant.count({ where }),
    ]);

    return {
      restaurants,
      total,
    };
  }

  async getRestaurantById(id: string): Promise<RestaurantResponse | null> {
    return this.prisma.restaurant.findUnique({
      where: { id },
    });
  }

  async updateRestaurant(
    id: string,
    input: UpdateRestaurantInput,
  ): Promise<RestaurantResponse> {
    const restaurant = await this.getRestaurantById(id);

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const businessId = input.businessId ?? restaurant.businessId;
    const slug = input.slug ?? restaurant.slug;

    if (input.businessId) {
      await this.ensureBusinessExists(input.businessId, this.prisma);
    }

    if (input.businessId || input.slug) {
      await this.ensureSlugIsAvailable(businessId, slug, id, this.prisma);
    }

    return this.prisma.restaurant.update({
      where: { id },
      data: input,
    });
  }

  async deleteRestaurant(id: string): Promise<RestaurantResponse> {
    const restaurant = await this.getRestaurantById(id);

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    return this.prisma.restaurant.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private async ensureBusinessExists(
    businessId: string,
    prisma: PrismaClient | Prisma.TransactionClient,
  ): Promise<void> {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true },
    });

    if (!business) {
      throw new Error("Business not found");
    }
  }

  private async ensureSlugIsAvailable(
    businessId: string,
    slug: string,
    currentRestaurantId: string | undefined,
    prisma: PrismaClient | Prisma.TransactionClient,
  ): Promise<void> {
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: {
        businessId_slug: {
          businessId,
          slug,
        },
      },
      select: { id: true },
    });

    if (existingRestaurant && existingRestaurant.id !== currentRestaurantId) {
      throw new Error("Restaurant slug already exists");
    }
  }
}
