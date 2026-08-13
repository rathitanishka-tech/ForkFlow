# Domain Model

ForkFlow's domain is centered on a restaurant's daily service flow: guests reserve tables, staff manage floors and menus, customers place QR orders, the kitchen advances those orders, and analytics summarize the operation.

## Core Domains

- Dashboard: operational overview for revenue, orders, reservations, tables, and popular items.
- Restaurant: tenant boundary for the active business location.
- Floors and Tables: physical seating layout, capacity, shapes, positions, and status.
- Menu: available items, categories, pricing, images, spice levels, and vegetarian flags.
- Reservations: guest bookings, party size, seating preferences, status actions, and dining-session handoff.
- Kitchen: order groups by preparation status.
- Orders: order lifecycle, table association, item quantities, and captured prices.
- Analytics: aggregated revenue, order counts, workload, reservations, table statuses, and best-selling item.
- QR Ordering: staff-generated table links to the customer menu.
- Customer Menu: public menu browsing and cart ordering.
- Customer Order Tracking: public order status view.

## Status Values

Tables use `AVAILABLE`, `RESERVED`, `OCCUPIED`, `MAINTENANCE`, and `UNAVAILABLE`.

Orders use `PENDING`, `PREPARING`, `READY`, `SERVED`, and `CANCELLED`.

Reservations use `PENDING`, `CONFIRMED`, `SEATED`, `CANCELLED`, `COMPLETED`, and `NO_SHOW`.

Dining sessions use `ACTIVE` and `CLOSED`.
