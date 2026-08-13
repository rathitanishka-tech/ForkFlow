import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { WebhookEvent } from "@clerk/nextjs/webhooks";
import { prisma } from "@/lib/prisma";
import { BusinessRole } from "@prisma/client";

/**
 * POST /api/webhooks/clerk
 *
 * Clerk webhook endpoint that keeps the local PostgreSQL `User` table in sync
 * with Clerk's user directory.
 *
 * This is the **only** place where a `User` row is created or updated.
 * Without it, `getCurrentRestaurant()` in `src/lib/server-restaurant.ts`
 * cannot find the authenticated Clerk user in the database and throws
 * "User not found in database for the given Clerk ID."
 *
 * Events handled:
 *   - user.created  → create User + BusinessMembership (OWNER)
 *   - user.updated  → upsert User record
 *   - user.deleted  → soft-delete / remove User record
 *
 * The webhook signing secret is configured in the Clerk dashboard under
 * "Webhooks" and must be provided via the CLERK_WEBHOOK_SIGNING_SECRET
 * environment variable.
 *
 * This endpoint is excluded from Clerk's middleware auth protection so that
 * Clerk's servers can deliver events without a session token.
 */
export async function POST(request: NextRequest) {
  let evt: WebhookEvent;

  try {
    evt = await verifyWebhook(request);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Webhook verification failed", { status: 400 });
  }

  const { id: clerkUserId, ...rest } = evt.data;

  try {
    switch (evt.type) {
      case "user.created":
      case "user.updated": {
        if (!clerkUserId) {
          console.error("Clerk webhook missing user ID");
          return new NextResponse("Missing Clerk user ID", { status: 400 });
        }

        await upsertUser(clerkUserId, rest);
        break;
      }

      case "user.deleted": {
        if (!clerkUserId) {
          console.error("Clerk webhook missing user ID for deletion");
          return new NextResponse("Missing Clerk user ID", { status: 400 });
        }
        await prisma.user.deleteMany({
          where: { clerkUserId },
        });
        break;
      }

      default:
        // Ignore events we don't care about
        break;
    }

    return new NextResponse("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

/**
 * Creates or updates a local `User` record from a Clerk `UserJSON` payload.
 *
 * On `user.created`, the user is also linked to the default business
 * (created by the seed) as an OWNER via a `BusinessMembership` row.
 * This establishes the full ownership chain:
 *
 *   Clerk User → User (clerkUserId) → BusinessMembership → Business → Restaurant
 */
async function upsertUser(clerkUserId: string, data: Record<string, unknown>) {
  const firstName = (data.first_name as string | null) ?? null;
  const lastName = (data.last_name as string | null) ?? null;
  const name = [firstName, lastName].filter(Boolean).join(" ") || "User";

  const emailAddresses = data.email_addresses as
    | Array<{ email_address: string }>
    | undefined;

  const primaryEmail = emailAddresses?.[0]?.email_address ?? null;

  const imageUrl = (data.image_url as string | null) ?? null;

  await prisma.user.upsert({
    where: { clerkUserId },
    update: {
      name,
      email: primaryEmail ?? "",
      image: imageUrl,
    },
    create: {
      clerkUserId,
      name,
      email: primaryEmail ?? "",
      image: imageUrl,
    },
  });

  // Link the user to the default business as an OWNER if not already linked.
  // The default business is created by the seed script (slug: "forkflow-hospitality").
  // This is NOT a fake fallback — it is the real business that already exists
  // in the database and owns the seeded restaurant data.
  const defaultBusiness = await prisma.business.findUnique({
    where: { slug: "forkflow-hospitality" },
    select: { id: true },
  });

  if (defaultBusiness) {
    await prisma.businessMembership.upsert({
      where: {
        userId_businessId: {
          userId: (await prisma.user.findUnique({
            where: { clerkUserId },
            select: { id: true },
          }))!.id,
          businessId: defaultBusiness.id,
        },
      },
      update: {
        role: BusinessRole.OWNER,
      },
      create: {
        user: { connect: { clerkUserId } },
        business: { connect: { id: defaultBusiness.id } },
        role: BusinessRole.OWNER,
      },
    });
  }
}
