"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  ArrowRight,
  BarChart,
  Calendar,
  ChefHat,
  Lightbulb,
  QrCode,
  Sparkles,
  UtensilsCrossed,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const featureList = [
  {
    title: "QR Code Ordering",
    description:
      "Streamline service with dynamic QR codes for instant, contactless ordering right from the table.",
    Icon: QrCode,
  },
  {
    title: "Smart Reservations",
    description:
      "Manage bookings effortlessly with an intuitive system that keeps the floor calm and efficient.",
    Icon: Calendar,
  },
  {
    title: "Live Kitchen Dashboard",
    description:
      "Keep your kitchen aligned with real-time order tracking from prep to service.",
    Icon: ChefHat,
  },
  {
    title: "In-Depth Analytics",
    description:
      "Gain clarity into sales, popular items and revenue trends to make confident decisions.",
    Icon: BarChart,
  },
];

const timelineSteps = [
  {
    title: "Restaurant Setup",
    description: "Configure your restaurant profile and settings in minutes.",
  },
  {
    title: "Floor Plan Design",
    description:
      "Digitize your layout with an elegant editor that feels effortless.",
  },
  {
    title: "QR Generation",
    description: "Instantly create and assign unique QR codes to each table.",
  },
  {
    title: "Customer Orders",
    description: "Guests scan, browse the menu and place orders seamlessly.",
  },
  {
    title: "Kitchen Management",
    description:
      "Orders appear on the kitchen dashboard for rapid preparation.",
  },
  {
    title: "Analytics & Insights",
    description: "Track performance and discover growth opportunities.",
  },
];

const techStack = [
  { name: "Next.js" },
  { name: "Prisma" },
  { name: "PostgreSQL" },
  { name: "TypeScript" },
];

export default function HomePage() {
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] font-sans selection:bg-[#0f5b4c]/20">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f5b4c] text-sm font-semibold text-white">
              FF
            </span>
            <span className="font-heading text-xl font-bold tracking-widest text-[#0F172A] uppercase">
              ForkFlow
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-8 text-sm font-medium text-[#0F172A] md:flex">
              <Link href="#features" className="transition hover:text-[#0f5b4c]">
                Features
              </Link>
              <Link href="#how-it-works" className="transition hover:text-[#0f5b4c]">
                How it works
              </Link>
              <Link href="#insights" className="transition hover:text-[#0f5b4c]">
                Insights
              </Link>
            </nav>
            
            <div className="hidden md:flex items-center ml-4">
              {!isLoaded || !isSignedIn ? (
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold text-[#0F172A] hover:text-[#0f5b4c] transition"
                >
                  Sign In
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-sm font-semibold text-[#0F172A] hover:text-[#0f5b4c] transition"
                >
                  Sign Out
                </button>
              )}
            </div>
            
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#0F172A] hover:text-[#0f5b4c] focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 top-full w-full border-b border-slate-200 bg-white px-4 py-4 shadow-lg md:hidden">
            <nav className="flex flex-col gap-4 text-sm font-medium text-[#0F172A]">
              <Link
                href="#features"
                className="block py-2 transition hover:text-[#0f5b4c]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="block py-2 transition hover:text-[#0f5b4c]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How it works
              </Link>
              <Link
                href="#insights"
                className="block py-2 transition hover:text-[#0f5b4c]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Insights
              </Link>
              <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4">
                {!isLoaded || !isSignedIn ? (
                  <>
                    <Link
                      href="/sign-in"
                      className="inline-flex w-full items-center justify-center rounded-sm border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition hover:border-slate-400"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="inline-flex w-full items-center justify-center rounded-sm bg-[#0f5b4c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b4a3d]"
                    >
                      Get Started
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="inline-flex w-full items-center justify-center rounded-sm bg-[#0f5b4c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b4a3d]"
                    >
                      Open Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="inline-flex w-full items-center justify-center rounded-sm border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition hover:border-slate-400"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24 xl:py-32">
          <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#0F172A] shadow-sm">
                <Sparkles className="h-3 w-3" />
                Hospitality, refined for modern restaurants
              </div>
              <h1 className="mt-8 font-heading text-5xl font-bold leading-[1.05] text-[#0F172A] sm:text-6xl lg:text-[5.5rem] tracking-tight">
                Run your restaurant<br/>with calm precision.
              </h1>
              <p className="mt-6 max-w-lg font-sans text-lg leading-relaxed text-slate-600">
                From the dining room to the kitchen pass, ForkFlow brings
                reservations, ordering, analytics and operations into one
                elegant experience.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                {!isLoaded || !isSignedIn ? (
                  <>
                    <Link
                      href="/sign-up"
                      className="inline-flex items-center justify-center rounded-sm bg-[#0f5b4c] px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#0b4a3d]"
                    >
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                      href="/sign-in"
                      className="inline-flex items-center justify-center rounded-sm border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#0F172A] transition-all hover:border-slate-400 hover:bg-slate-50"
                    >
                      Sign In
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center rounded-sm bg-[#0f5b4c] px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#0b4a3d]"
                    >
                      Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-sm bg-[#0f5b4c] p-6 text-white shadow-2xl">
              <div className="rounded-sm border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#a8ccaf]">
                      Service snapshot
                    </p>
                    <p className="mt-2 font-heading text-2xl font-bold">
                      Tonight at a glance
                    </p>
                  </div>
                  <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-sans text-xs font-semibold tracking-wider">
                    Live
                  </div>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-sm border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                    <p className="font-sans text-xs font-medium uppercase tracking-wider text-[#a8ccaf]">Reservations</p>
                    <p className="mt-2 font-heading text-3xl font-semibold">24</p>
                  </div>
                  <div className="rounded-sm border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                    <p className="font-sans text-xs font-medium uppercase tracking-wider text-[#a8ccaf]">Orders in flight</p>
                    <p className="mt-2 font-heading text-3xl font-semibold">12</p>
                  </div>
                </div>
                <div className="mt-4 rounded-sm border border-white/10 bg-[#0b4a3d] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                      <UtensilsCrossed className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-heading text-lg font-bold">Suggested pairings</p>
                      <p className="mt-1 font-sans text-sm leading-relaxed text-white/80">
                        Truffle burger and house fries are trending this
                        evening.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="px-4 py-20 sm:px-6 lg:px-8 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-slate-500">
                The foundations of service
              </p>
              <h2 className="mt-4 font-heading text-4xl font-bold text-[#0F172A] sm:text-5xl">
                Built for the rhythm of hospitality.
              </h2>
              <p className="mt-6 font-sans text-lg leading-relaxed text-slate-600">
                Every module feels deliberate, polished and calm, so your team
                can focus on guests instead of tooling.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {featureList.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-sm border border-slate-200 bg-[#FAF8F5] p-8 transition duration-300 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-none bg-[#0f5b4c] text-white">
                    <feature.Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 font-heading text-xl font-bold text-[#0F172A]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="bg-[#0F172A] px-4 py-24 text-white sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl text-center mx-auto">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-slate-400">
                How it works
              </p>
              <h2 className="mt-4 font-heading text-4xl font-bold sm:text-5xl">
                A streamlined path from setup to service.
              </h2>
            </div>
            <div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {timelineSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex flex-col items-center text-center px-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-600 font-heading text-lg font-bold text-slate-300">
                    0{index + 1}
                  </div>
                  <h3 className="mt-6 font-heading text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-slate-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="insights" className="bg-[#FAF8F5] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-sm border border-slate-200 bg-white p-10 shadow-sm flex flex-col justify-center">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-slate-500">
                Restaurant management
              </p>
              <h2 className="mt-4 font-heading text-4xl font-bold text-[#0F172A]">
                Elegant operations for every shift.
              </h2>
              <p className="mt-6 font-sans text-lg leading-relaxed text-slate-600">
                The dashboard keeps your team aligned without feeling noisy,
                while every action remains focused on service.
              </p>
              <Link
                href="/dashboard"
                className="mt-8 inline-flex items-center font-sans text-sm font-bold uppercase tracking-widest text-[#0f5b4c] hover:text-[#0b4a3d] transition-colors"
              >
                Explore the operator view <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-sm">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-slate-500">
                  QR Ordering
                </p>
                <h3 className="mt-4 font-heading text-2xl font-bold text-[#0F172A]">
                  Fast table-side ordering
                </h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-slate-600">
                  Guests order in seconds, and your team stays in control.
                </p>
              </div>
              <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-sm">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Kitchen
                </p>
                <h3 className="mt-4 font-heading text-2xl font-bold text-[#0F172A]">
                  Live status without clutter
                </h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-slate-600">
                  A focused workflow keeps prep, timing and service feeling
                  effortless.
                </p>
              </div>
              <div className="rounded-sm border border-[#0f5b4c]/20 bg-[#0f5b4c]/5 p-8 sm:col-span-2">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#0f5b4c]">
                  Analytics
                </p>
                <h3 className="mt-4 font-heading text-2xl font-bold text-[#0F172A]">
                  Beautiful KPIs that guide growth
                </h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-slate-700">
                  From peak dinner windows to top-selling dishes, every insight
                  is presented clearly and elegantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-24 sm:px-6 lg:px-8 border-t border-slate-200">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-slate-500">
                  AI features
                </p>
                <h2 className="mt-4 font-heading text-4xl font-bold text-[#0F172A]">
                  A thoughtful layer of intelligence.
                </h2>
                <p className="mt-6 font-sans text-lg leading-relaxed text-slate-600">
                  ForkFlow learns from patterns in your service and turns them
                  into practical recommendations that feel natural, not
                  intrusive.
                </p>
              </div>
              <div className="rounded-sm border border-slate-200 bg-[#FAF8F5] p-8 shadow-sm">
                <div className="flex items-start gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-white">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-heading text-xl font-bold text-[#0F172A]">
                      Best pairing right now
                    </p>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-slate-600">
                      High-volume dinner tables are trending toward premium
                      sides and dessert add-ons.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-[#FAF8F5] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 font-sans text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ForkFlow. Crafted for modern
            hospitality.
          </p>
          <div className="flex flex-wrap gap-4">
            {techStack.map((tech) => (
              <span
                key={tech.name}
                className="font-medium tracking-wide text-slate-600"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
