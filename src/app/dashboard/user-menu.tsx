"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";

export function UserMenu() {
  const { user } = useUser();
  const displayName = user?.firstName ?? user?.fullName ?? "Tanishka";

  return (
    <div className="flex h-10 items-center gap-2 rounded-full border border-border bg-card px-2.5 backdrop-blur">
      <span className="hidden max-w-24 truncate text-sm font-medium text-foreground sm:block">
        {displayName}
      </span>
      <ThemeToggle className="h-8 w-8 border-none bg-transparent hover:bg-muted" />
      <UserButton />
    </div>
  );
}
