"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

interface EditorialStory {
  id: string;
  kicker: string;
  title: string;
  italicWord?: string;
  body: string;
  points: string[];
  imageSrc: string;
  imageAlt: string;
  caption: string;
  isReversed: boolean;
}

const stories: EditorialStory[] = [
  {
    id: "story-foh",
    kicker: "Front-of-House Orchestration",
    title: "A dining room that moves in",
    italicWord: "effortless synchrony.",
    body: "When floor assignments, turn times, and guest seating are visible at a glance, hosts and servers spend more time delighting parties and less time searching for open tables. ForkFlow keeps table turnover smooth without rushing guests.",
    points: [
      "Instant table status visibility across host and server tablets",
      "Dynamic party matching to avoid awkward floor bottlenecks",
      "Calm front desk with zero paper clipboards or lost bookings",
    ],
    imageSrc: "/images/editorial/table-setting.jpg",
    imageAlt: "Warm restaurant interior with wooden tables, fine dining glassware, and natural ambient light",
    caption: "The Dining Room • Spatial Harmony",
    isReversed: false,
  },
  {
    id: "story-kitchen",
    kicker: "Culinary Line Execution",
    title: "Keep the line focused on craft,",
    italicWord: "not lost paper slips.",
    body: "Orders flow straight to kitchen display stations organized by preparation priority. Cooks see dietary requests and cooking modifications with crystal-clear contrast, eliminating ticket re-prints and shouting across the pass.",
    points: [
      "Real-time ticket routing by course, prep time, and station",
      "Immediate dietary markers for 100% vegetarian selections",
      "Pass chef marks orders ready to dispatch to floor runners",
    ],
    imageSrc: "/images/editorial/chef-pass.jpg",
    imageAlt: "Professional chef plating an artisanal culinary dish with tweezers and fresh herbs at the kitchen pass",
    caption: "The Kitchen Pass • Precision Plating",
    isReversed: true,
  },
  {
    id: "story-clarity",
    kicker: "Operational Clarity",
    title: "Actionable understanding of every",
    italicWord: "shift and cover.",
    body: "Make confident decisions guided by clean service analytics. Understand which vegetarian courses drive revenue, identify your busiest seating intervals, and refine kitchen prep schedules to maximize freshness and reduce food waste.",
    points: [
      "Cover velocity tracking across lunch and evening seatings",
      "Top-performing dishes and pairing trend identification",
      "Digestible performance summaries for owners and operators",
    ],
    imageSrc: "/images/editorial/plated-dish.jpg",
    imageAlt: "Gourmet plated vegetarian course with vibrant vegetables, microgreens, and delicate artistic presentation",
    caption: "The Culinary Standard • Balanced Flavor",
    isReversed: false,
  },
];

export function ConnectedServiceSection() {
  return (
    <section
      id="editorial-insights"
      className="relative bg-white py-24 sm:py-36 border-t border-[#174B36]/10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#174B36]/15 bg-[#F8F6F0] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#174B36]">
            <Sparkles className="h-3 w-3 text-[#D9A441]" />
            A More Connected Service
          </div>
          <h2 className="mt-4 font-editorial text-4xl font-normal tracking-tight text-[#171B18] sm:text-5xl">
            Technology that lives quietly in the background.
          </h2>
          <p className="mt-5 font-sans text-lg font-normal leading-relaxed text-[#171B18]/70">
            Great restaurant software should never get between your team and hospitality. Discover how ForkFlow unifies each dimension of your service.
          </p>
        </div>

        {/* Alternating Stories */}
        <div className="space-y-28 sm:space-y-36">
          {stories.map((story) => (
            <div
              key={story.id}
              className={`grid items-center gap-12 lg:grid-cols-12 lg:gap-16 ${
                story.isReversed ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image Column */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`lg:col-span-6 ${
                  story.isReversed ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <div className="group relative overflow-hidden rounded-2xl border border-[#174B36]/15 bg-[#EEE8DB] shadow-xl">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={story.imageSrc}
                      alt={story.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-104"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171B18]/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                  {/* Subtle editorial photo caption */}
                  <div className="absolute bottom-3 left-4 text-xs font-sans text-white/90">
                    <span className="font-editorial italic font-normal text-sm">{story.caption}</span>
                  </div>
                </div>
              </motion.div>

              {/* Text Column */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className={`lg:col-span-6 flex flex-col justify-center ${
                  story.isReversed ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#174B36]">
                  {story.kicker}
                </span>

                <h3 className="mt-3 font-editorial text-3xl font-normal leading-[1.18] tracking-tight text-[#171B18] sm:text-4xl">
                  {story.title}{" "}
                  {story.italicWord && (
                    <span className="italic font-light text-[#174B36]">
                      {story.italicWord}
                    </span>
                  )}
                </h3>

                <p className="mt-5 font-sans text-base leading-relaxed text-[#171B18]/75">
                  {story.body}
                </p>

                {/* Bullet Points */}
                <ul className="mt-6 space-y-3 font-sans text-sm text-[#171B18]/80">
                  {story.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#174B36] text-[#F8F6F0] mt-0.5">
                        <Check className="h-3 w-3 stroke-[2.5]" />
                      </div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
