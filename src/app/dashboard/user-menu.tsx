"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";

export function UserMenu() {
  const { user } = useUser();
  const displayName = user?.firstName ?? user?.fullName ?? "Manager";

  return (
    <div className="flex h-9 items-center gap-2 rounded-full border border-border bg-card px-2.5 shadow-xs">
      <span className="hidden max-w-32 truncate text-xs font-semibold text-foreground sm:block">
        {displayName}
      </span>
      <ThemeToggle className="h-7 w-7 border-none bg-transparent hover:bg-muted" />
      <UserButton />
    </div>
  );
}
