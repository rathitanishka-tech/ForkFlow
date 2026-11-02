"use client";

import { motion } from "framer-motion";
import { Users, Armchair, QrCode, ChefHat, CheckCircle2, ChevronRight } from "lucide-react";

interface JourneyStep {
  step: string;
  title: string;
  icon: React.ElementType;
}

const journeySteps: JourneyStep[] = [
  {
    step: "01",
    title: "Guest arrives",
    icon: Users,
  },
  {
    step: "02",
    title: "Table is assigned",
    icon: Armchair,
  },
  {
    step: "03",
    title: "Order is placed",
    icon: QrCode,
  },
  {
    step: "04",
    title: "Kitchen prepares",
    icon: ChefHat,
  },
  {
    step: "05",
    title: "Service is completed",
    icon: CheckCircle2,
  },
];

export function JourneySection() {
  return (
    <section
      id="how-it-works"
      className="relative py-20 sm:py-28 border-t border-[#E5E9E3] dark:border-[#344337]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#216E46] dark:text-[#74A96B] font-sans">
                The Restaurant Journey
              </span>
              <span className="h-[1.5px] w-12 bg-[#216E46]/30 dark:bg-[#74A96B]/30" />
            </div>

            <h2 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-[#17211A] dark:text-[#F5F6EF] sm:text-4xl lg:text-5xl">
              From guest to<br />great experience.
            </h2>

            <p className="mt-4 font-sans text-base leading-relaxed text-[#647067] dark:text-[#ADB8AA]">
              A seamless flow that keeps your service smooth, your team aligned, and your guests happy.
            </p>
          </div>

          {/* Right 5 Connected Step Cards */}
          <div className="lg:col-span-7">
            <div className="relative grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-2.5 items-stretch">
              {journeySteps.map((item, idx) => {
                const Icon = item.icon;
                const isLast = idx === journeySteps.length - 1;
                return (
                  <div key={item.step} className="relative flex flex-col">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45, delay: idx * 0.08 }}
                      className="relative flex flex-col items-center justify-between h-full rounded-2xl border border-[#E5E9E3] dark:border-[#344337] bg-white dark:bg-[#18221A] p-4 text-center shadow-xs transition-all duration-200 hover:border-[#216E46]/40 dark:hover:border-[#74A96B]/40 hover:-translate-y-1"
                    >
                      {/* Top Green Icon */}
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F2E8] dark:bg-[#202D22] text-[#216E46] dark:text-[#74A96B]">
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Circular Tomato-Red Step Badge */}
                      <div className="my-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#E5483F] dark:bg-[#FF6558] text-[11px] font-bold text-white shadow-2xs">
                        {item.step}
                      </div>

                      {/* Step Title */}
                      <p className="font-sans text-xs font-semibold text-[#17211A] dark:text-[#F5F6EF] leading-tight">
                        {item.title}
                      </p>
                    </motion.div>

                    {/* Connecting Arrow between cards (Visible on sm+ screens) */}
                    {!isLast && (
                      <div
                        className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#216E46]/50 dark:text-[#74A96B]/50 pointer-events-none"
                        aria-hidden="true"
                      >
                        <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
