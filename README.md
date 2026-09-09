# 🍽️ ForkFlow

ForkFlow is a comprehensive restaurant operations platform built to handle the end-to-end lifecycle of restaurant management. It provides staff dashboards, interactive floor and table management, reservations, kitchen order flows, analytics, QR code table ordering, and real-time customer order tracking.

---

## ✨ Features

- **📊 Staff Dashboard:** Real-time metrics tracking revenue, active orders, reservations, kitchen workload, and table occupancy.
- **🏪 Interactive Floor Planner:** Visual, Figma-style drag-and-drop floor plan editor with smart table placement, airtight collision boundaries, and live seating statuses.
- **🔐 Secure Operations:** Multi-tenant restaurant data scoping secured by Clerk authentication.
- **🥗 Customizable Menus:** A rich pre-configured vegetarian menu template that restaurants can select and customize during the onboarding process, complete with descriptions, pricing, and high-quality imagery.
- **📅 Reservations System:** Create, manage, and update statuses for upcoming and active bookings.
- **👨‍🍳 Kitchen Board:** Live kitchen workflow to track orders from `Pending` → `Preparing` → `Ready`.
- **📱 QR Ordering:** Generate table-specific QR codes, allowing customers to view the public menu and place orders directly from their phones.
- **🛒 Customer Experience:** Seamless public menu browsing, cart management, and order status tracking.
- **💾 Robust Data Model:** Powered by a Prisma-backed PostgreSQL database.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI & Styling:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/), [Prisma 6](https://www.prisma.io/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Language:** TypeScript

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
# Install dependencies
pnpm install
```

### 2. Environment Variables
Copy the `.env.example` file to create your local environment file:
```bash
cp .env.example .env.local
```
Ensure the following variables are populated in your `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/forkflow?schema=public
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 3. Database Setup
Generate the Prisma client and push the schema to your local database:
```bash
pnpm prisma generate
pnpm prisma migrate dev
```

### 4. Run the Application
Start the development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Architecture & Structure

ForkFlow is built with a modular domain-driven structure to keep business logic separated from routing:

```text
src/app              # Next.js App Router (Pages, layouts, API route handlers)
src/components       # Reusable UI components (Customer, Kitchen, QR, Floor, etc.)
src/hooks            # Custom React hooks (Customer-facing data fetching)
src/lib              # Core utilities (Prisma client, Clerk integrations, etc.)
src/modules          # Domain logic (Controllers, Services, Types, Validators)
prisma               # Database schema, migrations, and seed scripts
docs                 # API and architecture documentation
public/menu          # Local static assets and customer menu images
```

---

## 🌐 API Overview

ForkFlow provides a robust RESTful API (documented further in `docs/api.md`). Key domain groups include:
- **Management APIs:** `/api/restaurants`, `/api/floors`, `/api/tables`, `/api/orders`, `/api/kitchen`, `/api/reservations`
- **Analytics:** `/api/dashboard/analytics`
- **Public APIs (No Auth Required):** `/api/public/menu`, `/api/public/orders` (for QR ordering and tracking)

---

## 🚢 Deployment

ForkFlow is optimized for Vercel or any Node.js compatible platform. 

### Production Build
To create an optimized production build:
```bash
pnpm lint
pnpm build
```

When deploying, ensure your production database is migrated:
```bash
npx prisma migrate deploy
```

---

## 🔮 Future Roadmap

- 🧪 Automated service and route-handler testing suites.
- 🛡️ Granular role-based access control (Owner vs. Manager vs. Kitchen Staff).
- 📈 Advanced analytics CSV/PDF exports.
- 💳 Online payment integrations for customer orders.

