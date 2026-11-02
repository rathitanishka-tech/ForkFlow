"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Utensils } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function LandingNav() {
  const { isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      router.push("/");
    }
  };

  return (
    <div className="fixed top-3 sm:top-5 inset-x-0 z-50 px-4 sm:px-6 flex justify-center pointer-events-none">
      <header
        className="pointer-events-auto relative w-full max-w-6xl xl:max-w-7xl h-14 sm:h-16 rounded-full border border-[#E2E8DF]/90 dark:border-[#2D633F]/50 bg-[#F8F9F5]/85 dark:bg-[#111A13]/85 backdrop-blur-xl shadow-lg shadow-[#216E46]/5 dark:shadow-black/40 px-4 sm:px-6 flex items-center justify-between transition-all duration-300"
      >
        {/* Brand Logo & Wordmark (Left) */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#216E46] rounded-full"
        >
          {/* Tomato-red rounded brand badge with fork icon */}
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#E5483F] dark:bg-[#FF6558] text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
            <Utensils className="h-4 w-4" />
          </div>
          <span className="font-sans text-lg sm:text-xl font-bold tracking-tight text-[#17211A] dark:text-[#F5F6EF]">
            ForkFlow
          </span>
        </Link>

        {/* Desktop Navigation Links (Center) */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8 lg:gap-10 text-sm font-medium text-[#17211A]/80 dark:text-[#F5F6EF]/80 font-sans"
        >
          <a
            href="#features"
            className="py-1 transition-colors hover:text-[#216E46] dark:hover:text-[#74A96B]"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="py-1 transition-colors hover:text-[#216E46] dark:hover:text-[#74A96B]"
          >
            How It Works
          </a>
          <a
            href="#insights"
            className="py-1 transition-colors hover:text-[#216E46] dark:hover:text-[#74A96B]"
          >
            Insights
          </a>
        </nav>

        {/* Right Actions: Theme Toggle, Sign In, Get Started CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {!isLoaded ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-[#E8F2E8] dark:bg-[#202D22]" />
          ) : !isSignedIn ? (
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-3.5 py-1.5 text-sm font-medium text-[#17211A] dark:text-[#F5F6EF] transition-colors hover:text-[#216E46] dark:hover:text-[#74A96B]"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#E5483F] hover:bg-[#D43B32] dark:bg-[#FF6558] dark:hover:bg-[#E85346] px-5 py-2 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-[#17211A]/70 dark:text-[#F5F6EF]/70 transition-colors hover:text-[#17211A] dark:hover:text-[#F5F6EF]"
              >
                Sign Out
              </button>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#E5483F] hover:bg-[#D43B32] dark:bg-[#FF6558] dark:hover:bg-[#E85346] px-5 py-2 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Capsule Controls (Right) */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-full p-2 text-[#17211A] dark:text-[#F5F6EF] hover:bg-[#E8F2E8] dark:hover:bg-[#202D22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#216E46]"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Floating Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto absolute top-16 sm:top-20 inset-x-4 max-w-md mx-auto rounded-3xl border border-[#E5E9E3] dark:border-[#344337] bg-[#FAFAF7]/95 dark:bg-[#101712]/95 backdrop-blur-2xl p-6 shadow-2xl md:hidden"
          >
            <nav className="flex flex-col gap-4 text-base font-medium text-[#17211A] dark:text-[#F5F6EF]">
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-[#216E46] dark:hover:text-[#74A96B]"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-[#216E46] dark:hover:text-[#74A96B]"
              >
                How It Works
              </a>
              <a
                href="#insights"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-[#216E46] dark:hover:text-[#74A96B]"
              >
                Insights
              </a>

              <div className="mt-2 flex flex-col gap-3 border-t border-[#E5E9E3] dark:border-[#344337] pt-5">
                {!isLoaded || !isSignedIn ? (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center rounded-full border border-[#E5E9E3] dark:border-[#344337] bg-white dark:bg-[#18221A] py-2.5 text-sm font-medium text-[#17211A] dark:text-[#F5F6EF]"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center rounded-full bg-[#E5483F] dark:bg-[#FF6558] py-2.5 text-sm font-semibold text-white"
                    >
                      Get Started
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center rounded-full bg-[#E5483F] dark:bg-[#FF6558] py-2.5 text-sm font-semibold text-white"
                    >
                      Open Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex w-full items-center justify-center rounded-full border border-[#E5E9E3] dark:border-[#344337] bg-white dark:bg-[#18221A] py-2.5 text-sm font-medium text-[#17211A] dark:text-[#F5F6EF]"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
