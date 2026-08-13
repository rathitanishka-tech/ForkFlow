# Architecture

ForkFlow is a Next.js application organized around App Router pages, route handlers, domain modules, Prisma persistence, and reusable UI components.

## Runtime Layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| App routes | `src/app` | Staff dashboard pages, customer menu pages, customer order tracking, auth pages, and API route handlers. |
| Components | `src/components` and `src/app/dashboard` | UI primitives, floor canvas, kitchen board, reservations UI, QR cards, and customer ordering components. |
| Domain modules | `src/modules` | Controllers, services, validators, and types for restaurants, floors, tables, menu, orders, kitchen, reservations, and analytics. |
| Shared libraries | `src/lib` | Prisma client, current restaurant resolution, base URL, class-name utilities, and client hooks. |
| Database | `prisma` | Prisma schema, migrations, and seed script. |

## Authentication And Restaurant Isolation

Clerk provides authentication. Staff dashboard routes are protected by `src/middleware.ts`. Server-side restaurant resolution is centralized in `src/lib/server-restaurant.ts`, which maps the Clerk user to an internal user, business membership, business, and active restaurant.

Restaurant-scoped API handlers should call `getCurrentRestaurant()` and use the returned restaurant ID when creating or querying protected data. Public QR endpoints are intentionally separate under `/api/public`.

## Frontend Surfaces

- `/` presents the product entry point.
- `/dashboard` shows operational metrics and navigation.
- `/dashboard/floor` manages floor and table visibility.
- `/dashboard/reservations` manages reservations and table seating actions.
- `/dashboard/kitchen` shows the live kitchen workflow.
- `/dashboard/qr` generates customer menu QR codes.
- `/dashboard/analytics` visualizes revenue, order, and table metrics.
- `/menu/[restaurantId]` serves the customer menu.
- `/order/[id]` serves customer order tracking.

## Data Flow

Client pages fetch JSON from route handlers. Route handlers validate request input, delegate to controllers and services, and persist through Prisma. Services own business rules such as status transitions, duplicate checks, and restaurant-scoped queries.
