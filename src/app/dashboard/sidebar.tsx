"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Store,
  Table2,
  Utensils,
  Settings,
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Floor Planner", href: "/dashboard/floor", icon: Store },
  {
    label: "Reservations",
    href: "/dashboard/reservations",
    icon: ClipboardList,
  },
  { label: "QR Generator", href: "/dashboard/qr", icon: Table2 },
  { label: "Kitchen", href: "/dashboard/kitchen", icon: ChefHat },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function cx(...classes: Array<string | false>) {
  return classes.filter(Boolean).join(" ");
}

import { SignOutButton } from "@clerk/nextjs";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-70 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-20 items-center border-b border-sidebar-border px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            FF
          </span>
          <div>
            <p className="text-base font-semibold tracking-[0.24em] uppercase text-sidebar-foreground">
              ForkFlow
            </p>
            <p className="text-xs text-accent">Operations</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
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
                "flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium transition",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <SignOutButton>
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-sidebar-border bg-sidebar px-3 py-3 text-sm font-medium text-sidebar-foreground transition hover:bg-sidebar-accent cursor-pointer">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
