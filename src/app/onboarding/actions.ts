"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
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
      // Allow proceeding if account needs onboarding setup
    }
  }

  const name = formData.get("name") as string;
  const propertyType = formData.get("propertyType") as PropertyType;
  const tableCountStr = formData.get("tableCount") as string;
  const tableCount = parseInt(tableCountStr || "10", 10);
  const menuItemsStr = formData.get("menuItems") as string;
  let menuItems: any[] = [];
  if (menuItemsStr) {
    try {
      menuItems = JSON.parse(menuItemsStr);
    } catch (e) {
      console.error("Failed to parse menu items:", e);
    }
  }

  if (!name || !propertyType) {
    return { error: "Missing required fields" };
  }

  // Ensure user exists in our DB (webhook might have been delayed or not delivered locally)
  let dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!dbUser) {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${userId}@clerk.local`;
    const fullName = clerkUser?.firstName
      ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim()
      : "Restaurant Owner";

    const existingByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingByEmail) {
      dbUser = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          clerkUserId: userId,
          name: fullName,
          image: clerkUser?.imageUrl,
        },
      });
    } else {
      dbUser = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email,
          name: fullName,
          image: clerkUser?.imageUrl,
        },
      });
    }
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
          timezone: "UTC",
          currency: "INR",
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
      const cols = Math.max(3, Math.ceil(Math.sqrt(tableCount)));
      const rows = Math.ceil(tableCount / cols);

      for (let i = 0; i < tableCount; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        
        const xPosition = 5 + (col * (90 / Math.max(1, cols - 1))); 
        const yPosition = 5 + (row * (90 / Math.max(1, rows - 1)));

        tableData.push({
          floorId: floor.id,
          number: (i + 1).toString(),
          capacity: 4,
          shape: TableShape.SQUARE,
          xPosition: Math.min(xPosition, 95),
          yPosition: Math.min(yPosition, 95),
          isActive: true,
        });
      }
      
      await tx.table.createMany({
        data: tableData,
      });

      // 6. Create initial menu items
      if (menuItems.length > 0) {
        const menuData = menuItems.map((item: any) => ({
          restaurantId: restaurant.id,
          name: item.name,
          description: item.description,
          price: typeof item.price === "number" ? item.price : parseFloat(item.price),
          preparationTime: item.preparationTime || 15,
          isVeg: item.isVeg ?? true,
          spiceLevel: item.spiceLevel || "NONE",
          category: item.category || "Other",
          isAvailable: true,
        }));
        
        await tx.menuItem.createMany({
          data: menuData,
        });
      }
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return { error: "Failed to create restaurant. Please try again." };
  }

  redirect("/dashboard");
}
