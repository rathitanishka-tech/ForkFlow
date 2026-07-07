"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  Package,
  ReceiptText,
  Settings,
  Store,
  Table2,
  Users,
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Restaurants", href: "/dashboard/restaurants", icon: Store },
  { label: "Reservations", href: "/dashboard/reservations", icon: ClipboardList },
  { label: "Tables", href: "/dashboard/tables", icon: Table2 },
  { label: "Orders", href: "/dashboard/orders", icon: ReceiptText },
  { label: "Kitchen", href: "/dashboard/kitchen", icon: ChefHat },
  { label: "Inventory", href: "/dashboard/inventory", icon: Package },
  { label: "Staff", href: "/dashboard/staff", icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function cx(...classes: Array<string | false>) {
  return classes.filter(Boolean).join(" ");
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[280px] flex-col border-r border-neutral-200 bg-white">
      <div className="flex h-16 items-center border-b border-neutral-200 px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-950 text-sm font-semibold text-white">
            FF
          </span>
          <span className="text-base font-semibold text-neutral-950">
            ForkFlow
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition",
                isActive
                  ? "bg-neutral-950 text-white"
                  : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
