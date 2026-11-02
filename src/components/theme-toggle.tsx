"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#E5E9E3] dark:border-[#344337] bg-white dark:bg-[#18221A] text-[#17211A] dark:text-[#F5F6EF] transition hover:bg-[#F2F5F0] dark:hover:bg-[#202D22]",
          className
        )}
        aria-label="Toggle theme"
      >
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#E5E9E3] dark:border-[#344337] bg-white dark:bg-[#18221A] text-[#17211A] dark:text-[#F5F6EF] transition hover:bg-[#F2F5F0] dark:hover:bg-[#202D22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#216E46] dark:focus-visible:ring-[#74A96B]",
        className
      )}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-[#FF6558]" />
      ) : (
        <Moon className="h-4 w-4 text-[#216E46]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
