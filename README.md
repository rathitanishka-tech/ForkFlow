# ForkFlow

ForkFlow is a restaurant operations platform for staff dashboards, floor and table management, menu operations, reservations, kitchen order flow, analytics, QR ordering, customer menus, and customer order tracking.

## Features

- Staff dashboard with revenue, order, reservation, kitchen, and table metrics
- Restaurant-scoped operations resolved from Clerk authentication
- Menu item management with categories, pricing, images, availability, vegetarian flags, and spice levels
- Floor and table views with seating status and layout data
- Reservation creation and status actions
- Kitchen board for order preparation workflow
- Public QR menu links for table ordering
- Customer menu, cart, order submission, and order tracking
- Prisma-backed PostgreSQL data model

## Architecture

ForkFlow uses Next.js App Router pages and route handlers, domain modules for controllers/services/validators, Prisma for persistence, Clerk for auth, and Tailwind-based UI components.

```text
src/app              Pages, layouts, route handlers, and dashboard shell
src/components       Reusable UI, customer, floor, kitchen, QR, and reservation components
src/hooks            Customer-facing data hooks
src/lib              Prisma client, restaurant resolution, base URL, and utilities
src/modules          Domain controllers, services, validators, and types
prisma               Schema, migrations, and seed script
docs                 Current implementation documentation
public/menu_items    Local customer menu images
```

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Prisma 6
- PostgreSQL
- Clerk
- Tailwind CSS
- Base UI primitives
- Recharts
- Framer Motion
- Zod

## Installation

```bash
pnpm install
cp .env.example .env.local
pnpm prisma generate
pnpm prisma migrate dev
```

## Environment Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/forkflow?schema=public
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Running Locally

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Production Build

```bash
pnpm lint
pnpm build
```

For production database migrations:

```bash
pnpm prisma migrate deploy
```

## Deployment

Deploy the Next.js app to a Node-compatible platform such as Vercel. Configure the environment variables above, connect a PostgreSQL database, and run Prisma migrations during release.

## API Overview

The API is documented in `docs/api.md`. Main groups include restaurants, current restaurant, floors, tables, menu, orders, kitchen, reservations, dashboard analytics, public menu, and public order tracking.

## Screenshots

Add screenshots for:

- Dashboard
- Floor view
- Reservations
- Kitchen board
- QR ordering
- Customer menu
- Order tracking

## Future Improvements

- Automated service and route-handler tests
- Role-specific authorization policies
- Richer analytics exports
- More advanced table-layout editing
- Production observability

## License

Private project. Add a license before distributing publicly.
