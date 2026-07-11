"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export function UserMenu() {
  const { user } = useUser();
  const displayName = user?.firstName ?? user?.fullName ?? "Tanishka";

  return (
    <div className="flex h-10 items-center gap-2 rounded-md border border-neutral-200 bg-white px-2.5">
      <span className="hidden max-w-24 truncate text-sm font-medium text-neutral-700 sm:block">
        {displayName}
      </span>
      <UserButton />
    </div>
  );
}
