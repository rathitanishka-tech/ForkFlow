# Database

The database is configured in `prisma/schema.prisma` and accessed through the shared Prisma client in `src/lib/prisma.ts`.

## Required Environment

`DATABASE_URL` must point to a PostgreSQL-compatible database.

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/forkflow?schema=public
```

## Prisma Workflow

```bash
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed
```

Production deployments should apply committed migrations with:

```bash
pnpm prisma migrate deploy
```

## Current Models

The active Prisma models are `User`, `Business`, `BusinessMembership`, `Restaurant`, `Floor`, `Table`, `Guest`, `Reservation`, `DiningSession`, `MenuItem`, `Order`, and `OrderItem`.
