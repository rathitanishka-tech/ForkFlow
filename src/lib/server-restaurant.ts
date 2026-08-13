import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Represents the full restaurant object resolved from the authenticated
 * Clerk user. This is the single source of truth for "which restaurant
 * does the current user own / belong to?"
 *
 * The ownership chain is:
 *   Clerk User → User (clerkUserId) → BusinessMembership → Business → Restaurant
 */
export interface CurrentRestaurant {
  id: string;
  businessId: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  propertyType: string;
  timezone: string;
  currency: string;
  parkingAvailable: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Error thrown when the authenticated user does not have a restaurant
 * configured. Callers can catch this and show an appropriate UI.
 */
export class RestaurantNotFoundError extends Error {
  constructor(message = "No restaurant found for the current user.") {
    super(message);
    this.name = "RestaurantNotFoundError";
  }
}

/**
 * Error thrown when the user is not authenticated.
 */
export class AuthenticationError extends Error {
  constructor(message = "User is not authenticated.") {
    super(message);
    this.name = "AuthenticationError";
  }
}

/**
 * Resolves the current authenticated user's restaurant on the server.
 *
 * This helper MUST be called from a server context (API route, Server
 * Component, or server action). It reads the Clerk session via `auth()`,
 * then walks the ownership chain step by step:
 *
 *   1. Read Clerk auth()             → throw AuthenticationError if missing
 *   2. Resolve User (clerkUserId)    → throw AuthenticationError if not found
 *   3. Resolve BusinessMembership    → throw RestaurantNotFoundError if none
 *   4. Resolve Business              → (included in membership query)
 *   5. Resolve Restaurant            → throw RestaurantNotFoundError if none
 *
 * The restaurant is NEVER determined from localStorage, query parameters,
 * request body, or headers. Every request resolves the restaurant
 * server-side from the Clerk session.
 *
 * @returns The resolved restaurant object.
 * @throws {AuthenticationError} If the user is not authenticated or not found.
 * @throws {RestaurantNotFoundError} If no restaurant is found for the user.
 */
export async function getCurrentRestaurant(): Promise<CurrentRestaurant> {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    throw new AuthenticationError();
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: {
      id: true,
      memberships: {
        select: {
          business: {
            select: {
              id: true,
              restaurants: {
                where: { isActive: true },
                take: 1,
                select: {
                  id: true,
                  businessId: true,
                  name: true,
                  slug: true,
                  description: true,
                  phone: true,
                  email: true,
                  address: true,
                  propertyType: true,
                  timezone: true,
                  currency: true,
                  parkingAvailable: true,
                  isActive: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new AuthenticationError(
      "User not found in database for the given Clerk ID.",
    );
  }

  if (!user.memberships || user.memberships.length === 0) {
    throw new RestaurantNotFoundError(
      "No business membership found for the current user.",
    );
  }

  for (const membership of user.memberships) {
    if (
      membership.business.restaurants &&
      membership.business.restaurants.length > 0
    ) {
      return membership.business.restaurants[0];
    }
  }

  throw new RestaurantNotFoundError(
    "No active restaurant found for the current user's business.",
  );
}

/**
 * Resolves the current restaurant and returns just its ID.
 * Convenience wrapper around getCurrentRestaurant().
 */
export async function getCurrentRestaurantId(): Promise<string> {
  const restaurant = await getCurrentRestaurant();
  return restaurant.id;
}

/**
 * Handles authentication and restaurant-resolution errors from API routes.
 *
 * Returns a NextResponse with the appropriate HTTP status code when the
 * error is an {@link AuthenticationError} (401) or
 * {@link RestaurantNotFoundError} (404). Returns `null` for any other
 * error type, allowing the caller to fall through to its own error
 * handling logic.
 *
 * This utility avoids duplicate error-handling code across every API route
 * that calls `getCurrentRestaurant()`.
 *
 * @example
 * ```ts
 * try {
 *   const restaurant = await getCurrentRestaurant();
 *   // ... handler logic
 * } catch (error) {
 *   const authResponse = handleRestaurantApiError(error);
 *   if (authResponse) return authResponse;
 *   // ... other error handling
 * }
 * ```
 */
export function handleRestaurantApiError(error: unknown): NextResponse | null {
  if (error instanceof AuthenticationError) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  if (error instanceof RestaurantNotFoundError) {
    return NextResponse.json(
      { message: "No restaurant configured for this user" },
      { status: 404 },
    );
  }

  return null;
}
