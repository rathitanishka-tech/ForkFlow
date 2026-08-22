"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export function UserMenu() {
  const { user } = useUser();
  const displayName = user?.firstName ?? user?.fullName ?? "Tanishka";

  return (
    <div className="flex h-10 items-center gap-2 rounded-full border border-border bg-card px-2.5 backdrop-blur">
      <span className="hidden max-w-24 truncate text-sm font-medium text-foreground sm:block">
        {displayName}
      </span>
      <UserButton />
    </div>
  );
}
