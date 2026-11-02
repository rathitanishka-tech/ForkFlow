"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  CalendarDays,
  QrCode,
  ChefHat,
  BarChart3,
} from "lucide-react";

interface FeatureCardItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ElementType;
}

// Exactly 5 foundational service modules matching the Master Reference
const features: FeatureCardItem[] = [
  {
    id: "floor",
    title: "Floor & Tables",
    description: "Design and manage your restaurant layout with ease.",
    imageSrc: "/images/landing/dining-tables.jpg",
    imageAlt: "Restaurant dining room tables with tableware",
    icon: LayoutGrid,
  },
  {
    id: "reservations",
    title: "Reservations",
    description: "Take, manage, and keep track of every reservation.",
    imageSrc: "/images/landing/reserved-sign.jpg",
    imageAlt: "Reserved wooden sign on a restaurant table",
    icon: CalendarDays,
  },
  {
    id: "qr",
    title: "QR Ordering",
    description: "Let guests browse, order, and pay from their table.",
    imageSrc: "/images/landing/qr-table.jpg",
    imageAlt: "QR code digital menu stand on a dining table",
    icon: QrCode,
  },
  {
    id: "kitchen",
    title: "Kitchen Flow",
    description: "Keep orders organized and your kitchen in sync.",
    imageSrc: "/images/landing/kitchen-flame.jpg",
    imageAlt: "Chef cooking fresh ingredients in kitchen wok with flame",
    icon: ChefHat,
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Understand your restaurant with real insights.",
    imageSrc: "/images/landing/analytics-screen.jpg",
    imageAlt: "Laptop screen displaying restaurant data and metrics",
    icon: BarChart3,
  },
];

export function FoundationsSection() {
  return (
    <section
      id="features"
      className="relative py-20 sm:py-28 border-t border-[#E5E9E3] dark:border-[#344337]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Split Headline (Matches reference) */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#216E46] dark:text-[#74A96B] font-sans">
                The Foundations of Service
              </span>
              <span className="h-[1.5px] w-12 bg-[#216E46]/30 dark:bg-[#74A96B]/30" />
            </div>
            <h2 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-[#17211A] dark:text-[#F5F6EF] sm:text-4xl lg:text-5xl">
              Everything in its right place.
            </h2>
          </div>
          <p className="max-w-xs font-sans text-sm text-[#647067] dark:text-[#ADB8AA] leading-relaxed">
            The tools your restaurant needs, working together beautifully.
          </p>
        </div>

        {/* 5-Column Responsive Grid matching the Master Reference */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 items-stretch">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="group relative flex flex-col h-full min-w-0 rounded-2xl border border-[#E5E9E3] dark:border-[#2D633F]/40 bg-white dark:bg-[#18221A] p-3.5 sm:p-4 shadow-xs transition-all duration-300 hover:border-[#216E46]/50 dark:hover:border-[#74A96B]/50 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Photo Top Container with Fixed Aspect Ratio */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#E8F2E8] dark:bg-[#202D22]">
                  <Image
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 dark:bg-black/25 pointer-events-none" />
                </div>

                {/* Overlapping Round Icon Badge with clean ring separation */}
                <div className="-mt-5 ml-3 relative z-10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#216E46] dark:bg-[#74A96B] text-white dark:text-[#101712] ring-4 ring-white dark:ring-[#18221A] shadow-md transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Content Block */}
                <div className="mt-3 flex flex-col flex-grow px-1">
                  <h3 className="font-sans text-base sm:text-lg font-bold text-[#17211A] dark:text-[#F5F6EF] group-hover:text-[#216E46] dark:group-hover:text-[#74A96B] transition-colors leading-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-2 font-sans text-xs sm:text-[13px] leading-relaxed text-[#647067] dark:text-[#ADB8AA] flex-grow">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
