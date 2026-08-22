"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export function UserMenu() {
  const { user } = useUser();
  const displayName = user?.firstName ?? user?.fullName ?? "Tanishka";

  return (
    <div className="flex h-10 items-center gap-2 rounded-full border border-[#29443C] bg-[#10231E] px-2.5 backdrop-blur">
      <span className="hidden max-w-24 truncate text-sm font-medium text-[#f8f5ef] sm:block">
        {displayName}
      </span>
      <UserButton />
    </div>
  );
}
