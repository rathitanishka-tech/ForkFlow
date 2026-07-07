import { Bell, ChevronsUpDown, Menu, Search } from "lucide-react";

import { Sidebar } from "./sidebar";
import { UserMenu } from "./user-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-neutral-200 bg-white px-4 lg:px-6">
      <div className="lg:hidden">
        <input id="dashboard-sidebar" type="checkbox" className="peer sr-only" />
        <label
          htmlFor="dashboard-sidebar"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </label>
        <label
          htmlFor="dashboard-sidebar"
          className="fixed inset-0 z-40 hidden bg-neutral-950/40 peer-checked:block"
          aria-label="Close navigation"
        />
        <div className="fixed inset-y-0 left-0 z-50 hidden w-70 peer-checked:block">
          <Sidebar />
        </div>
      </div>

      <button className="flex h-10 min-w-0 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-800 hover:bg-neutral-50">
        <span className="truncate">Select Restaurant</span>
        <ChevronsUpDown
          className="h-4 w-4 shrink-0 text-neutral-500"
          aria-hidden="true"
        />
      </button>

      <div className="relative hidden flex-1 md:block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          aria-hidden="true"
        />
        <input
          type="search"
          disabled
          placeholder="Search (Coming Soon)"
          className="h-10 w-full cursor-not-allowed rounded-md border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-sm outline-none transition placeholder:text-neutral-400 disabled:text-neutral-500"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
        </button>
        <UserMenu />
      </div>
    </header>
  );
}
