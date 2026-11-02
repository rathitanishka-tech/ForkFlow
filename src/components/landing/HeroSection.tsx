"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  ClipboardList,
  ChevronDown,
  LayoutGrid,
  CalendarDays,
  QrCode,
  ChefHat,
  BarChart3,
  Armchair,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function HeroSection() {
  const { isSignedIn } = useUser();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
      {/* Subtle ambient lighting for Dark mode */}
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-[#216E46]/10 dark:bg-[#74A96B]/15 blur-3xl opacity-60 dark:opacity-80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -left-32 h-[450px] w-[450px] rounded-full bg-[#E5483F]/5 dark:bg-[#FF6558]/8 blur-3xl opacity-50"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Headline & Value Proposition */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 flex flex-col justify-center"
          >
            {/* Eyebrow with dash (matches reference image) */}
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#17211A]/80 dark:text-[#F5F6EF]/80 font-sans">
                Restaurant Operations, Simplified
              </span>
              <span className="h-[1.5px] w-12 bg-[#17211A]/25 dark:bg-[#F5F6EF]/25" />
            </motion.div>

            {/* Bold Headline with "service." in Tomato Red */}
            <motion.h1
              variants={itemVariants}
              className="mt-6 font-sans text-5xl font-extrabold tracking-tight text-[#17211A] dark:text-[#F5F6EF] sm:text-6xl lg:text-[4.25rem] leading-[1.08]"
            >
              A better rhythm<br />
              for every{" "}
              <span className="text-[#E5483F] dark:text-[#FF6558]">service.</span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-lg font-sans text-base font-normal leading-relaxed text-[#647067] dark:text-[#ADB8AA] sm:text-lg"
            >
              From the first reservation to the final order, ForkFlow brings your
              restaurant’s tables, kitchen, and operations into one seamless
              experience.
            </motion.p>

            {/* CTAs matching reference */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                href={isSignedIn ? "/dashboard" : "/sign-up"}
                className="inline-flex items-center gap-2 rounded-full bg-[#E5483F] hover:bg-[#D43B32] dark:bg-[#FF6558] dark:hover:bg-[#E85346] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5483F]"
              >
                <span>{isSignedIn ? "Open Dashboard" : "Get Started"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-[#E5E9E3] dark:border-[#344337] bg-white dark:bg-transparent px-7 py-3.5 text-sm font-medium text-[#17211A] dark:text-[#F5F6EF] shadow-2xs transition-all duration-200 hover:bg-[#F2F5F0] dark:hover:bg-[#202D22] hover:-translate-y-0.5"
              >
                Explore the Platform
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Restaurant Staff Coordinating Operations in Action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="lg:col-span-6 relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[480px]">
              {/* Circular Frame showing real staff managing service & orders */}
              <div className="relative aspect-square w-full overflow-hidden rounded-full border-4 border-white dark:border-[#2D633F]/70 shadow-2xl bg-[#E8F2E8]/40 dark:bg-[#18221A]">
                <Image
                  src="/images/landing/waitstaff-service-pos.jpg"
                  alt="Restaurant manager and service staff coordinating dining operations and orders"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center scale-105 transition-transform duration-700 hover:scale-110"
                />
                {/* Subtle depth vignette */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Top-Right Overlaid Snapshot Card ("Today at Govindas") */}
              <motion.div
                initial={{ opacity: 0, y: -16, x: 10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="absolute -top-3 right-0 sm:-right-4 w-[240px] sm:w-[260px] rounded-2xl border border-[#E5E9E3] dark:border-[#344337] bg-white/95 dark:bg-[#18221A]/95 p-4 sm:p-5 shadow-2xl backdrop-blur-md z-10"
              >
                {/* Radiance accent strokes above top-right corner */}
                <div className="absolute -top-3.5 -right-2 flex gap-1 pointer-events-none" aria-hidden="true">
                  <span className="h-3 w-[2px] bg-[#E5483F] dark:bg-[#FF6558] rotate-[-25deg] rounded-full" />
                  <span className="h-4 w-[2px] bg-[#E5483F] dark:bg-[#FF6558] rounded-full" />
                  <span className="h-3 w-[2px] bg-[#E5483F] dark:bg-[#FF6558] rotate-[25deg] rounded-full" />
                </div>

                {/* Card Header with Dropdown */}
                <div className="flex items-center justify-between border-b border-[#E5E9E3] dark:border-[#344337] pb-3">
                  <span className="text-xs font-bold text-[#17211A] dark:text-[#F5F6EF] flex items-center gap-1.5">
                    Today at Govindas
                    <ChevronDown className="h-3.5 w-3.5 text-[#647067] dark:text-[#ADB8AA]" />
                  </span>
                </div>

                {/* 3 Metric Rows matching reference */}
                <div className="mt-3.5 space-y-3 font-sans text-xs">
                  {/* Reservations */}
                  <div className="flex items-center justify-between text-[#17211A] dark:text-[#F5F6EF]">
                    <div className="flex items-center gap-2 text-[#647067] dark:text-[#ADB8AA]">
                      <Calendar className="h-3.5 w-3.5 text-[#216E46] dark:text-[#74A96B]" />
                      <span>Reservations</span>
                    </div>
                    <span className="font-bold text-[#17211A] dark:text-[#F5F6EF]">12</span>
                  </div>

                  {/* Active Orders */}
                  <div className="flex items-center justify-between text-[#17211A] dark:text-[#F5F6EF]">
                    <div className="flex items-center gap-2 text-[#647067] dark:text-[#ADB8AA]">
                      <ClipboardList className="h-3.5 w-3.5 text-[#216E46] dark:text-[#74A96B]" />
                      <span>Active Orders</span>
                    </div>
                    <span className="font-bold text-[#17211A] dark:text-[#F5F6EF]">8</span>
                  </div>

                  {/* Occupied Tables */}
                  <div className="flex items-center justify-between text-[#17211A] dark:text-[#F5F6EF]">
                    <div className="flex items-center gap-2 text-[#647067] dark:text-[#ADB8AA]">
                      <Armchair className="h-3.5 w-3.5 text-[#216E46] dark:text-[#74A96B]" />
                      <span>Occupied Tables</span>
                    </div>
                    <span className="font-bold text-[#216E46] dark:text-[#74A96B]">14/24</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Horizontal Docked Quick Modules Bar (Matches Reference Image) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 sm:mt-20 overflow-x-auto pb-2"
        >
          <div className="mx-auto min-w-[680px] max-w-4xl rounded-2xl md:rounded-full border border-[#E5E9E3] dark:border-[#2D633F]/40 bg-white/90 dark:bg-[#142318]/90 px-6 sm:px-10 py-4 shadow-lg backdrop-blur-md">
            <div className="grid grid-cols-5 divide-x divide-[#E5E9E3] dark:divide-[#2D633F]/40 text-center">
              {/* Module 1 */}
              <a
                href="#features"
                className="group flex flex-col items-center justify-center gap-2 px-2 hover:opacity-80 transition"
              >
                <div className="text-[#216E46] dark:text-[#74A96B] transition-transform group-hover:scale-110">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-[#17211A] dark:text-[#F5F6EF]">
                  Floor & Tables
                </span>
              </a>

              {/* Module 2 */}
              <a
                href="#features"
                className="group flex flex-col items-center justify-center gap-2 px-2 hover:opacity-80 transition"
              >
                <div className="text-[#216E46] dark:text-[#74A96B] transition-transform group-hover:scale-110">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-[#17211A] dark:text-[#F5F6EF]">
                  Reservations
                </span>
              </a>

              {/* Module 3 */}
              <a
                href="#features"
                className="group flex flex-col items-center justify-center gap-2 px-2 hover:opacity-80 transition"
              >
                <div className="text-[#216E46] dark:text-[#74A96B] transition-transform group-hover:scale-110">
                  <QrCode className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-[#17211A] dark:text-[#F5F6EF]">
                  QR Ordering
                </span>
              </a>

              {/* Module 4 */}
              <a
                href="#features"
                className="group flex flex-col items-center justify-center gap-2 px-2 hover:opacity-80 transition"
              >
                <div className="text-[#216E46] dark:text-[#74A96B] transition-transform group-hover:scale-110">
                  <ChefHat className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-[#17211A] dark:text-[#F5F6EF]">
                  Kitchen Flow
                </span>
              </a>

              {/* Module 5 */}
              <a
                href="#features"
                className="group flex flex-col items-center justify-center gap-2 px-2 hover:opacity-80 transition"
              >
                <div className="text-[#216E46] dark:text-[#74A96B] transition-transform group-hover:scale-110">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-[#17211A] dark:text-[#F5F6EF]">
                  Analytics
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
