"use client";

import Link from "next/link";
import { Utensils, ArrowUpRight } from "lucide-react";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E5E9E3] dark:border-[#344337] bg-white dark:bg-[#141C16] py-14 sm:py-16 text-[#17211A] dark:text-[#F5F6EF] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E5483F] dark:bg-[#FF6558] text-white shadow-xs">
                <Utensils className="h-4 w-4" />
              </div>
              <span className="font-sans text-xl font-bold tracking-tight text-[#17211A] dark:text-[#F5F6EF]">
                ForkFlow
              </span>
            </Link>
            <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-[#647067] dark:text-[#ADB8AA]">
              Restaurant operations simplified. Designed to keep your dining room calm, your kitchen line in sync, and your guests delighted.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-[#216E46] dark:text-[#74A96B] font-semibold">
              <span className="h-2 w-2 rounded-full bg-[#216E46] dark:bg-[#74A96B]" />
              <span>Tomato & Basil Design System</span>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {/* Features */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#216E46] dark:text-[#74A96B]">
                Platform
              </p>
              <ul className="mt-3.5 space-y-2 text-sm font-sans text-[#647067] dark:text-[#ADB8AA]">
                <li>
                  <a href="#features" className="hover:text-[#216E46] dark:hover:text-[#74A96B] transition-colors">
                    Floor & Tables
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#216E46] dark:hover:text-[#74A96B] transition-colors">
                    Reservations
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#216E46] dark:hover:text-[#74A96B] transition-colors">
                    QR Ordering
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#216E46] dark:hover:text-[#74A96B] transition-colors">
                    Kitchen Flow
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#216E46] dark:hover:text-[#74A96B] transition-colors">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>

            {/* Experience */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#216E46] dark:text-[#74A96B]">
                Experience
              </p>
              <ul className="mt-3.5 space-y-2 text-sm font-sans text-[#647067] dark:text-[#ADB8AA]">
                <li>
                  <a href="#how-it-works" className="hover:text-[#216E46] dark:hover:text-[#74A96B] transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#insights" className="hover:text-[#216E46] dark:hover:text-[#74A96B] transition-colors">
                    Operator View
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#216E46] dark:hover:text-[#74A96B] transition-colors">
                    Kitchen Pass
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#216E46] dark:hover:text-[#74A96B] transition-colors">
                    Customer Experience
                  </a>
                </li>
              </ul>
            </div>

            {/* Access */}
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#216E46] dark:text-[#74A96B]">
                Access
              </p>
              <ul className="mt-3.5 space-y-2 text-sm font-sans text-[#647067] dark:text-[#ADB8AA]">
                <li>
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center gap-1 hover:text-[#216E46] dark:hover:text-[#74A96B] transition-colors"
                  >
                    <span>Sign In</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-1 hover:text-[#216E46] dark:hover:text-[#74A96B] transition-colors"
                  >
                    <span>Get Started</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1 hover:text-[#216E46] dark:hover:text-[#74A96B] transition-colors"
                  >
                    <span>Dashboard</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E9E3] dark:border-[#344337] pt-8 text-xs font-sans text-[#647067] dark:text-[#ADB8AA]">
          <p>
            © {currentYear} ForkFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[#647067] dark:text-[#ADB8AA]">
            <span>Next.js</span>
            <span>•</span>
            <span>Tailwind CSS v4</span>
            <span>•</span>
            <span>Tomato & Basil</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
