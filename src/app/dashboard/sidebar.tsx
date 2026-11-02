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
  UtensilsCrossed,
  Utensils,
  Settings,
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Floor Planner", href: "/dashboard/floor", icon: Store },
  {
    label: "Reservations",
    href: "/dashboard/reservations",
    icon: ClipboardList,
  },
  { label: "QR Ordering", href: "/dashboard/qr", icon: Table2 },
  { label: "Kitchen Flow", href: "/dashboard/kitchen", icon: ChefHat },
  { label: "Menu", href: "/dashboard/menu", icon: UtensilsCrossed },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-70 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Brand Header */}
      <div className="flex h-20 items-center border-b border-sidebar-border px-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5483F] text-white shadow-sm transition-transform group-hover:scale-105">
            <Utensils className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-sidebar-foreground">
              ForkFlow
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Operations Suite
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3.5 py-5">
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
                "flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#216E46] text-white shadow-sm dark:bg-[#74A96B] dark:text-[#101712]"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className={cx("h-4 w-4", isActive ? "text-current" : "text-muted-foreground")} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-sidebar-border p-4">
        <SignOutButton>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-sidebar-border bg-sidebar px-3.5 py-2.5 text-sm font-medium text-sidebar-foreground transition hover:bg-sidebar-accent cursor-pointer">
            <LogOut className="h-4 w-4 text-muted-foreground" />
            <span>Logout</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
