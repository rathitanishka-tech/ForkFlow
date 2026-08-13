import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        { message: "Restaurant ID is required." },
        { status: 400 },
      );
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: restaurantId,
      },
      select: {
        id: true,
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { message: "Restaurant not found." },
        { status: 404 },
      );
    }

    const menuItems = await prisma.menuItem.findMany({
      where: {
        restaurantId,
        isAvailable: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        category: true,
        spiceLevel: true,
        isVeg: true,
        isAvailable: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    console.error("[PUBLIC_MENU_GET]", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
