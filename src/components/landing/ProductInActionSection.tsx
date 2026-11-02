"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Utensils,
  LayoutDashboard,
  Store,
  ClipboardList,
  ChefHat,
  BarChart3,
  Settings,
  CalendarCheck,
  Table2,
  IndianRupee,
  Clock,
  Sparkles,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function ProductInActionSection() {
  const { isSignedIn } = useUser();

  return (
    <section
      id="insights"
      className="relative overflow-hidden py-20 sm:py-28 border-t border-[#E5E9E3] dark:border-[#344337]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Realistic Laptop Mockup with Authentic ForkFlow Dashboard (55-60% width) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="lg:col-span-7 relative flex justify-center w-full"
          >
            {/* The Laptop Device Frame */}
            <div className="relative w-full max-w-[640px] xl:max-w-[690px]">
              {/* Laptop Display Lid: Thin dark metallic bezel with camera notch */}
              <div className="overflow-hidden rounded-t-2xl sm:rounded-t-[1.4rem] border-[6px] sm:border-[7px] border-[#1B231D] dark:border-[#232D25] bg-[#0E1510] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)]">
                {/* Camera Bezel Bar */}
                <div className="flex justify-center py-1 sm:py-1.5 bg-[#121A14]">
                  <div className="h-1.5 w-1.5 rounded-full bg-black/80 ring-1 ring-white/20" />
                </div>

                {/* Internal Screen: Authentic ForkFlow Management Dashboard */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0C150F] text-[#F3F5F0] select-none font-sans">
                  {/* Subtle Screen Reflection Glare */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.04] z-20"
                    aria-hidden="true"
                  />

                  <div className="grid h-full grid-cols-12">
                    {/* Left App Sidebar Navigation (Compact) */}
                    <div className="col-span-3 border-r border-white/10 bg-[#070E09] p-2.5 sm:p-3 flex flex-col justify-between text-[10px] sm:text-[11px]">
                      <div>
                        {/* ForkFlow Brand Header */}
                        <div className="flex items-center gap-1.5 mb-3.5 sm:mb-4">
                          <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-lg bg-[#E5483F] text-white shadow-xs">
                            <Utensils className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </div>
                          <div className="flex flex-col leading-none">
                            <span className="font-bold text-xs tracking-tight text-white">ForkFlow</span>
                            <span className="text-[8px] text-emerald-400 font-medium">Ops Suite</span>
                          </div>
                        </div>

                        {/* Navigation Items */}
                        <div className="space-y-1">
                          {/* Active Dashboard Tab in Basil Green */}
                          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#216E46] text-white font-semibold shadow-xs">
                            <LayoutDashboard className="h-3 w-3" />
                            <span>Dashboard</span>
                          </div>
                          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-white/60 hover:text-white transition">
                            <Store className="h-3 w-3" />
                            <span>Floor Plan</span>
                          </div>
                          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-white/60 hover:text-white transition">
                            <ClipboardList className="h-3 w-3" />
                            <span>Bookings</span>
                          </div>
                          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-white/60 hover:text-white transition">
                            <ChefHat className="h-3 w-3" />
                            <span>Kitchen</span>
                          </div>
                          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-white/60 hover:text-white transition">
                            <BarChart3 className="h-3 w-3" />
                            <span>Analytics</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Settings Link */}
                      <div className="flex items-center gap-2 px-2 py-1 text-white/40 pt-2 border-t border-white/5">
                        <Settings className="h-3 w-3" />
                        <span>Settings</span>
                      </div>
                    </div>

                    {/* Main Dashboard Content Area */}
                    <div className="col-span-9 p-3 sm:p-4 flex flex-col justify-between bg-gradient-to-b from-[#0F1B14] via-[#0D1711] to-[#0A120D] overflow-hidden">
                      {/* Top Bar: Location & Date Pill */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                          <span className="font-bold text-[11px] sm:text-xs text-white">Govindas Dining Room</span>
                        </div>
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-white/80 font-medium">
                          Today • Dinner Service
                        </span>
                      </div>

                      {/* Greeting Header */}
                      <div className="pt-2">
                        <h3 className="font-bold text-xs sm:text-sm text-white tracking-tight">
                          Good Evening, Chef
                        </h3>
                        <p className="text-[9px] sm:text-[10px] text-white/60">
                          Live pulse across your restaurant floor & kitchen today.
                        </p>
                      </div>

                      {/* KPI Metric Cards (4 Columns) */}
                      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 pt-1.5">
                        {/* KPI 1: Reservations */}
                        <div className="rounded-lg border border-white/10 bg-white/5 p-1.5 sm:p-2">
                          <div className="flex items-center justify-between text-white/60">
                            <span className="text-[8px] uppercase tracking-wider font-semibold">Bookings</span>
                            <CalendarCheck className="h-2.5 w-2.5 text-emerald-400" />
                          </div>
                          <div className="mt-1 text-xs sm:text-sm font-bold text-white">18</div>
                          <div className="text-[7.5px] text-white/50">Today</div>
                        </div>

                        {/* KPI 2: Occupied Tables */}
                        <div className="rounded-lg border border-white/10 bg-white/5 p-1.5 sm:p-2">
                          <div className="flex items-center justify-between text-white/60">
                            <span className="text-[8px] uppercase tracking-wider font-semibold">Occupied</span>
                            <Table2 className="h-2.5 w-2.5 text-[#74A96B]" />
                          </div>
                          <div className="mt-1 text-xs sm:text-sm font-bold text-[#74A96B]">14/24</div>
                          <div className="text-[7.5px] text-white/50">58% capacity</div>
                        </div>

                        {/* KPI 3: Kitchen Orders */}
                        <div className="rounded-lg border border-white/10 bg-white/5 p-1.5 sm:p-2">
                          <div className="flex items-center justify-between text-white/60">
                            <span className="text-[8px] uppercase tracking-wider font-semibold">Kitchen</span>
                            <ChefHat className="h-2.5 w-2.5 text-amber-400" />
                          </div>
                          <div className="mt-1 text-xs sm:text-sm font-bold text-white">8 Active</div>
                          <div className="text-[7.5px] text-amber-400 font-medium">3 ready</div>
                        </div>

                        {/* KPI 4: Today's Revenue */}
                        <div className="rounded-lg border border-white/10 bg-white/5 p-1.5 sm:p-2">
                          <div className="flex items-center justify-between text-white/60">
                            <span className="text-[8px] uppercase tracking-wider font-semibold">Revenue</span>
                            <IndianRupee className="h-2.5 w-2.5 text-emerald-400" />
                          </div>
                          <div className="mt-1 text-xs sm:text-sm font-bold text-white">₹48,250</div>
                          <div className="text-[7.5px] text-emerald-400 font-medium">+14% vs avg</div>
                        </div>
                      </div>

                      {/* Split Floor Overview & Live Kitchen Pass */}
                      <div className="grid grid-cols-12 gap-2 pt-2">
                        {/* Left: Mini Visual Floor Planner */}
                        <div className="col-span-7 rounded-xl border border-white/10 bg-[#0B150E] p-2 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-[8px] font-semibold text-white/70 border-b border-white/5 pb-1">
                            <span className="uppercase tracking-wider">Live Floor Overview</span>
                            <span className="text-emerald-400 font-medium">14 Active Tables</span>
                          </div>

                          {/* Mini Table Node Representation matching Floor Planner */}
                          <div className="grid grid-cols-4 gap-1.5 py-1.5">
                            {/* Table 1: Round Available */}
                            <div className="flex flex-col items-center">
                              <div className="relative h-6 w-6 rounded-full bg-[#226B4D] border border-[#3B8A61] flex items-center justify-center text-[8px] font-bold text-white shadow-xs">
                                1
                                <span className="absolute -top-0.5 right-0 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-1 ring-[#0B150E]" />
                              </div>
                              <span className="text-[7px] text-white/50 mt-0.5">2p</span>
                            </div>

                            {/* Table 2: Square Occupied (Tomato Red status dot) */}
                            <div className="flex flex-col items-center">
                              <div className="relative h-6 w-6 rounded-lg bg-[#226B4D] border border-[#3B8A61] flex items-center justify-center text-[8px] font-bold text-white shadow-xs">
                                2
                                <span className="absolute -top-0.5 right-0 h-1.5 w-1.5 rounded-full bg-[#FF6258] ring-1 ring-[#0B150E]" />
                              </div>
                              <span className="text-[7px] text-white/50 mt-0.5">4p</span>
                            </div>

                            {/* Table 3: Rectangle Occupied */}
                            <div className="flex flex-col items-center">
                              <div className="relative h-6 w-8 rounded-lg bg-[#226B4D] border border-[#3B8A61] flex items-center justify-center text-[8px] font-bold text-white shadow-xs">
                                3
                                <span className="absolute -top-0.5 right-0 h-1.5 w-1.5 rounded-full bg-[#FF6258] ring-1 ring-[#0B150E]" />
                              </div>
                              <span className="text-[7px] text-white/50 mt-0.5">6p</span>
                            </div>

                            {/* Table 4: Round Reserved (Amber status dot) */}
                            <div className="flex flex-col items-center">
                              <div className="relative h-6 w-6 rounded-full bg-[#226B4D] border border-[#3B8A61] flex items-center justify-center text-[8px] font-bold text-white shadow-xs">
                                4
                                <span className="absolute -top-0.5 right-0 h-1.5 w-1.5 rounded-full bg-amber-400 ring-1 ring-[#0B150E]" />
                              </div>
                              <span className="text-[7px] text-white/50 mt-0.5">4p</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[7px] text-white/40 pt-1 border-t border-white/5">
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" /> Available
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6258] inline-block" /> Occupied
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" /> Reserved
                            </span>
                          </div>
                        </div>

                        {/* Right: Live Kitchen Pass Orders */}
                        <div className="col-span-5 rounded-xl border border-white/10 bg-[#0B150E] p-2 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-[8px] font-semibold text-white/70 border-b border-white/5 pb-1">
                            <span className="uppercase tracking-wider">Kitchen Flow</span>
                            <span className="text-amber-400 font-medium">8 in Queue</span>
                          </div>

                          <div className="space-y-1.5 py-1 text-[8px]">
                            {/* Order 1 */}
                            <div className="flex items-center justify-between rounded-md bg-white/5 px-1.5 py-1">
                              <div className="flex flex-col">
                                <span className="font-bold text-white">#1042 • T-4</span>
                                <span className="text-[7px] text-white/60">Paneer Tikka (3)</span>
                              </div>
                              <span className="rounded bg-sky-500/20 text-sky-300 px-1 py-0.5 font-semibold text-[7px]">
                                Prep 4m
                              </span>
                            </div>

                            {/* Order 2 */}
                            <div className="flex items-center justify-between rounded-md bg-white/5 px-1.5 py-1">
                              <div className="flex flex-col">
                                <span className="font-bold text-white">#1041 • T-7</span>
                                <span className="text-[7px] text-white/60">Dal Makhani (2)</span>
                              </div>
                              <span className="rounded bg-emerald-500/20 text-emerald-300 px-1 py-0.5 font-semibold text-[7px]">
                                Ready
                              </span>
                            </div>
                          </div>

                          <div className="text-[7px] text-white/40 pt-0.5 border-t border-white/5 flex items-center justify-between">
                            <span>Avg prep: 9m</span>
                            <span className="text-emerald-400">Normal velocity</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Sync Line */}
                      <div className="flex items-center justify-between text-[8px] text-white/40 border-t border-white/10 pt-1.5">
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                          <span>AI Smart Floor active</span>
                        </span>
                        <span className="text-[#74A96B] font-medium">Synced with Floor & Kitchen • 100% live</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Keyboard Metallic Base */}
              <div className="relative mx-auto h-3 sm:h-3.5 w-[104%] -left-[2%] rounded-b-xl bg-gradient-to-b from-[#2E3630] via-[#222924] to-[#181F1A] shadow-[0_14px_35px_rgba(0,0,0,0.6)] border-t border-white/20">
                {/* Center Thumb Notch */}
                <div className="mx-auto h-1 w-16 sm:w-20 rounded-b-md bg-[#121814] shadow-inner" />
              </div>

              {/* Natural Base Shadow underneath laptop */}
              <div
                className="w-[90%] mx-auto h-3 bg-black/40 blur-md rounded-full -mt-0.5 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </motion.div>

          {/* Right Column: Narrative & Checkmarks (Matches Reference & Preserved) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#216E46] dark:text-[#74A96B] font-sans">
                ForkFlow in Action
              </span>
              <span className="h-[1.5px] w-12 bg-[#216E46]/30 dark:bg-[#74A96B]/30" />
            </div>

            {/* Headline */}
            <h2 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-[#17211A] dark:text-[#F5F6EF] sm:text-4xl lg:text-5xl">
              A clear view of<br />your restaurant.
            </h2>

            {/* Body */}
            <p className="mt-4 font-sans text-base leading-relaxed text-[#647067] dark:text-[#ADB8AA]">
              Manage your floor, track reservations, handle orders, and keep your service flowing — all in one place.
            </p>

            {/* Checkmark List */}
            <ul className="mt-6 space-y-3 font-sans text-sm font-medium text-[#17211A] dark:text-[#F5F6EF]">
              <li className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#216E46] dark:bg-[#74A96B] text-white dark:text-[#101712]">
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
                <span>Visual floor planner</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#216E46] dark:bg-[#74A96B] text-white dark:text-[#101712]">
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
                <span>Real-time order updates</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#216E46] dark:bg-[#74A96B] text-white dark:text-[#101712]">
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
                <span>Reservation management</span>
              </li>
            </ul>

            {/* Action Button in Tomato Red (Coral CTA) */}
            <div className="mt-8">
              <Link
                href={isSignedIn ? "/dashboard" : "/sign-up"}
                className="inline-flex items-center gap-2 rounded-full bg-[#E5483F] hover:bg-[#D43B32] dark:bg-[#FF6558] dark:hover:bg-[#E85346] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5483F]"
              >
                <span>Explore Features</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
