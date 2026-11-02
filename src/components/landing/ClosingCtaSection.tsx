"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function ClosingCtaSection() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <section className="relative overflow-hidden bg-[#174B36] py-28 sm:py-36 text-[#F8F6F0]">
      {/* Subtle organic ambient background gradient */}
      <div
        className="pointer-events-none absolute -top-48 -left-48 h-96 w-96 rounded-full bg-[#DCE7D9]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-[#0F3526] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Top Kicker Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#DCE7D9] backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#D9A441]" />
            Modern Hospitality Platform
          </div>

          {/* Headline */}
          <h2 className="mt-8 font-editorial text-4xl font-normal leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Make every service feel{" "}
            <span className="italic font-light text-[#DCE7D9]">
              effortless.
            </span>
          </h2>

          {/* Supporting Copy */}
          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-[#F8F6F0]/80 sm:text-lg">
            Join the restaurants replacing chaotic floor clipboards and lost kitchen tickets with a calm, unified operating rhythm. Start today in minutes.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            {!isLoaded ? (
              <div className="h-12 w-40 animate-pulse rounded-full bg-white/20" />
            ) : !isSignedIn ? (
              <>
                <Link
                  href="/sign-up"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#F8F6F0] px-8 py-4 text-sm font-semibold tracking-wide text-[#174B36] shadow-lg transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span>Get Started</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-transparent px-8 py-4 text-sm font-semibold tracking-wide text-[#F8F6F0] transition-all duration-300 hover:border-white hover:bg-white/10 hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#F8F6F0] px-8 py-4 text-sm font-semibold tracking-wide text-[#174B36] shadow-lg transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Enter Your Dashboard</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )}
          </div>

          {/* Reassuring Checklist */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-[#DCE7D9] font-sans">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#D9A441]" />
              <span>No proprietary POS hardware needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#D9A441]" />
              <span>Works on standard tablets & smartphones</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#D9A441]" />
              <span>Immediate onboarding</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
