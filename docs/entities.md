# Entities

## User

Internal user record linked to Clerk by `clerkUserId`. A user can belong to one or more businesses through memberships.

## Business And Membership

`Business` owns restaurants. `BusinessMembership` assigns users to businesses with roles such as owner, admin, manager, staff, or kitchen.

## Restaurant

The main tenant and operations boundary. Restaurants own floors, menu items, reservations, orders, and dining sessions.

## Floor And Table

Floors group tables for a restaurant. Tables store number, capacity, shape, status, layout coordinates, rotation, and active state.

## Guest, Reservation, DiningSession

Guests can have reservations and dining sessions. Reservations bind guests to restaurant tables at scheduled times. Dining sessions track active or closed service visits.

## MenuItem

Menu items store name, description, price, preparation time, image, category, availability, vegetarian flag, and spice level.

## Order And OrderItem

Orders belong to a restaurant and table. Order items point to menu items, store quantity, and preserve the line-item price at order time.
