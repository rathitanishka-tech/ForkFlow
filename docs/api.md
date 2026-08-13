# API Reference

ForkFlow uses Next.js App Router route handlers under `src/app/api`. Authenticated staff endpoints resolve the active restaurant from the Clerk session on the server. Public endpoints accept explicit restaurant or order identifiers because they support guest QR ordering and order tracking.

## Conventions

- Responses are JSON.
- Validation uses Zod in the module validator files.
- Authenticated restaurant-scoped handlers call `getCurrentRestaurant()` and do not trust client-supplied restaurant ownership.
- Unexpected server failures return a generic `500` response and keep diagnostic details in server logs.

## Public Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/public/menu?restaurantId=:id` | Return available menu items for the customer menu. |
| `POST` | `/api/public/orders` | Create a guest order for a restaurant and table. |
| `GET` | `/api/public/orders/:id` | Return order details, items, menu item data, and table data for customer tracking. |

## Restaurant Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/restaurants` | List restaurants with optional filters. |
| `POST` | `/api/restaurants` | Create a restaurant. |
| `GET` | `/api/restaurants/:id` | Fetch one restaurant. |
| `PATCH` | `/api/restaurants/:id` | Update a restaurant. |
| `DELETE` | `/api/restaurants/:id` | Soft-delete a restaurant by setting `isActive` to `false`. |
| `GET` | `/api/restaurant/current` | Return the restaurant resolved from the current Clerk session. |

## Floor And Table Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/floors` | List floors for the current restaurant. |
| `POST` | `/api/floors` | Create a floor for the current restaurant. |
| `GET` | `/api/floors/:id` | Fetch a floor. |
| `PATCH` | `/api/floors/:id` | Update a floor. |
| `DELETE` | `/api/floors/:id` | Delete a floor. |
| `GET` | `/api/tables` | List tables, optionally by floor. |
| `POST` | `/api/tables` | Create a table. |
| `GET` | `/api/tables/:id` | Fetch a table. |
| `PUT` | `/api/tables/:id` | Update a table. |
| `DELETE` | `/api/tables/:id` | Delete a table. |

## Menu Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/menu` | List menu items for the current restaurant. |
| `POST` | `/api/menu` | Create a menu item. |
| `GET` | `/api/menu/:id` | Fetch a menu item. |
| `PATCH` | `/api/menu/:id` | Update a menu item. |
| `DELETE` | `/api/menu/:id` | Delete a menu item. |
| `POST` | `/api/menu/:id` | Toggle menu item availability. |

## Orders, Kitchen, Reservations, Analytics

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/orders` | List restaurant orders. |
| `POST` | `/api/orders` | Create a staff-side order. |
| `GET` | `/api/orders/:id` | Fetch an order. |
| `PATCH` | `/api/orders/:id` | Update order status or data. |
| `DELETE` | `/api/orders/:id` | Delete an order. |
| `GET` | `/api/kitchen` | Return grouped kitchen board orders. |
| `PATCH` | `/api/kitchen/:id` | Update an order's kitchen status. |
| `GET` | `/api/reservations` | List reservations. |
| `POST` | `/api/reservations` | Create a reservation. |
| `PATCH` | `/api/reservations/:id` | Apply reservation actions such as confirm, seat, complete, cancel, or no-show. |
| `GET` | `/api/dashboard/analytics` | Return dashboard metrics, revenue series, reservations, orders, and table statuses. |
