"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BusinessRole, PropertyType, TableShape } from "@prisma/client";
import { getCurrentRestaurant, RestaurantNotFoundError } from "@/lib/server-restaurant";

export async function createRestaurantAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthenticated" };
  }

  // Double check they don't already have a restaurant to prevent abuse
  try {
    await getCurrentRestaurant();
    redirect("/dashboard");
  } catch (error) {
    if (!(error instanceof RestaurantNotFoundError)) {
      return { error: "An unexpected error occurred verifying your account." };
    }
  }

  const name = formData.get("name") as string;
  const propertyType = formData.get("propertyType") as PropertyType;
  const tableCountStr = formData.get("tableCount") as string;
  const tableCount = parseInt(tableCountStr || "10", 10);

  if (!name || !propertyType) {
    return { error: "Missing required fields" };
  }

  // Ensure user exists in our DB (webhook might have been delayed)
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!dbUser) {
    return { error: "Your account is still being provisioned. Please try again in a few seconds." };
  }

  const slugBase = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
    
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const businessSlug = `${slugBase}-${randomSuffix}`;
  const restaurantSlug = slugBase;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create Business
      const business = await tx.business.create({
        data: {
          name,
          slug: businessSlug,
        },
      });

      // 2. Link User to Business as OWNER
      await tx.businessMembership.create({
        data: {
          userId: dbUser.id,
          businessId: business.id,
          role: BusinessRole.OWNER,
        },
      });

      // 3. Create Restaurant
      const restaurant = await tx.restaurant.create({
        data: {
          businessId: business.id,
          name,
          slug: restaurantSlug,
          propertyType: propertyType,
          timezone: "UTC", // Defaulting to UTC for simplicity
          currency: "USD", // Defaulting to USD for simplicity
          parkingAvailable: false,
          isActive: true,
        },
      });

      // 4. Create a default Main Floor so the Floor planner doesn't crash
      const floor = await tx.floor.create({
        data: {
          restaurantId: restaurant.id,
          name: "Main Floor",
          level: 1,
          width: 800,
          height: 600,
          isActive: true,
        },
      });

      // 5. Create requested tables
      const tableData = [];
      const cols = 5;
      for (let i = 0; i < tableCount; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        tableData.push({
          floorId: floor.id,
          number: (i + 1).toString(),
          capacity: 4,
          shape: TableShape.SQUARE,
          xPosition: 100 + (col * 150),
          yPosition: 100 + (row * 150),
          isActive: true,
        });
      }
      
      await tx.table.createMany({
        data: tableData
      });
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return { error: "Failed to create restaurant. Please try again." };
  }

  redirect("/dashboard");
}
