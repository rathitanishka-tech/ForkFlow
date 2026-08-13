# Database Design

ForkFlow uses Prisma with PostgreSQL. The schema models restaurant operations around businesses, restaurants, floors, tables, guests, reservations, dining sessions, menu items, orders, and order items.

## Tenancy Model

- `User` stores the internal user mapped to `clerkUserId`.
- `Business` represents an owning organization.
- `BusinessMembership` connects users to businesses with a role.
- `Restaurant` belongs to a business and is the primary operational boundary for floors, menu items, reservations, orders, and dining sessions.

## Operations Model

- `Floor` belongs to a restaurant and contains tables.
- `Table` belongs to a floor and tracks capacity, shape, position, rotation, active state, and operational status.
- `Guest` stores reservation and dining-session guest identity.
- `Reservation` connects a guest, table, and restaurant at a scheduled time.
- `DiningSession` represents an active or closed in-restaurant visit.
- `MenuItem` belongs to a restaurant and is used by order items.
- `Order` belongs to a restaurant and table.
- `OrderItem` stores quantity and captured item price for an order line.

## Integrity Rules

- Restaurant slugs are unique per business.
- Floor levels are unique per restaurant.
- Table numbers are unique per floor.
- Menu item names are unique per restaurant.
- Reservations are unique per table and reservation time.
- Cascading deletes keep child records aligned with their parent restaurant, floor, table, guest, menu item, or order.
