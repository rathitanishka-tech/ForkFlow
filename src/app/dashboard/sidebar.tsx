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
];

function cx(...classes: Array<string | false>) {
  return classes.filter(Boolean).join(" ");
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-70 flex-col border-r border-[#29443C] bg-[#081E19] text-[#f8f5ef]">
      <div className="flex h-20 items-center border-b border-[#29443C] px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0f5b4c] text-sm font-semibold text-[#f8f5ef]">
            FF
          </span>
          <div>
            <p className="text-base font-semibold tracking-[0.24em] uppercase text-[#f8f5ef]">
              ForkFlow
            </p>
            <p className="text-xs text-[#d6b48c]">Operations</p>
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
                  ? "bg-[#0f5b4c] text-[#f8f5ef] shadow-[0_10px_25px_rgba(15,91,76,0.2)]"
                  : "text-[#9fb4ab] hover:bg-[#10231E] hover:text-[#f8f5ef",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#29443C] p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#29443C] bg-[#10231E] px-3 py-3 text-sm font-medium text-[#f8f5ef] transition hover:bg-[#16342D]">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
