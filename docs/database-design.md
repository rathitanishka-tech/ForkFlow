# Database Design

## Entities

1. User
2. Business
3. Restaurant
4. Floor
5. Table
6. Reservation
7. DiningSession
8. MenuCategory
9. MenuItem
10. Order
11. OrderItem
12. KitchenTicket
13. InventoryItem
14. Staff
15. Invoice
16. Payment
17. Notification

---

## Relationships

User
└── owns many Businesses

Business
└── owns many Restaurants

Restaurant
├── has many Floors
├── has many Staff
├── has many Menu Categories
├── has many Reservations
├── has many Inventory Items

Floor
└── has many Tables

Table
└── has many Dining Sessions

Dining Session
├── belongs to one Table
├── has many Orders
├── belongs to one Reservation (optional)

Order
├── has many Order Items
├── has one Kitchen Ticket
├── belongs to one Dining Session

Menu Category
└── has many Menu Items

Invoice
└── has many Payments
