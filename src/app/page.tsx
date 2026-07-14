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
  Table,
  UtensilsCrossed,
} from "lucide-react";

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
  {
    title: "AI Menu Recommendations",
    description:
      "Increase sales by suggesting items that are frequently ordered together, powered by your own data.",
    Icon: Lightbulb,
  },
  {
    title: "AI Table Recommendations",
    description:
      "Optimize seating for every party with suggestions that feel thoughtful and precise.",
    Icon: Table,
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
    <div className="min-h-screen bg-[#f8f5ef] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-[#0f5b4c]/10 bg-[#f8f5ef]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f5b4c] text-sm font-semibold text-[#f8f5ef]">
              FF
            </span>
            <span className="text-lg font-semibold tracking-[0.24em] text-slate-900 uppercase">
              ForkFlow
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-700 md:flex">
            <Link href="#features" className="transition hover:text-[#0f5b4c]">
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="transition hover:text-[#0f5b4c]"
            >
              How it works
            </Link>
            <Link href="#insights" className="transition hover:text-[#0f5b4c]">
              Insights
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,180,140,0.25),transparent_46%),radial-gradient(circle_at_90%_20%,rgba(15,91,76,0.12),transparent_32%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0f5b4c]/15 bg-white/70 px-3 py-1 text-sm font-medium text-[#0f5b4c]">
                <Sparkles className="h-4 w-4" />
                Hospitality, refined for modern restaurants
              </div>
              <h1 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
                Run your restaurant with calm precision.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                From the dining room to the kitchen pass, ForkFlow brings
                reservations, ordering, analytics and operations into one
                elegant experience.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {!isLoaded || !isSignedIn ? (
                  <>
                    <Link
                      href="/sign-up"
                      className="inline-flex items-center justify-center rounded-full bg-[#0f5b4c] px-6 py-3 text-sm font-semibold text-[#f8f5ef] shadow-[0_18px_40px_rgba(15,91,76,0.2)] transition hover:-translate-y-0.5 hover:bg-[#0b4a3d]"
                    >
                      Get Started
                    </Link>
                    <Link
                      href="/sign-in"
                      className="inline-flex items-center justify-center rounded-full border border-[#0f5b4c]/20 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0f5b4c]/35 hover:text-[#0f5b4c]"
                    >
                      Sign In
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center rounded-full bg-[#0f5b4c] px-6 py-3 text-sm font-semibold text-[#f8f5ef] shadow-[0_18px_40px_rgba(15,91,76,0.2)] transition hover:-translate-y-0.5 hover:bg-[#0b4a3d]"
                    >
                      Open Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="inline-flex items-center justify-center rounded-full border border-[#0f5b4c]/20 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0f5b4c]/35 hover:text-[#0f5b4c]"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#0f5b4c]/10 bg-[#0f5b4c] p-6 text-[#f8f5ef] shadow-[0_30px_80px_rgba(15,91,76,0.18)]">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.34em] text-[#d6b48c]">
                      Service snapshot
                    </p>
                    <p className="mt-2 text-3xl font-semibold">
                      Tonight at a glance
                    </p>
                  </div>
                  <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-[#f8f5ef]">
                    Live
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-[#113b2e] p-4">
                    <p className="text-sm text-[#d6b48c]">Reservations</p>
                    <p className="mt-2 text-3xl font-semibold">24</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#113b2e] p-4">
                    <p className="text-sm text-[#d6b48c]">Orders in flight</p>
                    <p className="mt-2 text-3xl font-semibold">12</p>
                  </div>
                </div>
                <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.03))] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d6b48c] text-[#0f5b4c]">
                      <UtensilsCrossed className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Suggested pairings</p>
                      <p className="text-sm text-[#f8f5ef]/75">
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

        <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.36em] text-[#0f5b4c]">
                The foundations of service
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">
                Built for the rhythm of hospitality.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Every module feels deliberate, polished and calm, so your team
                can focus on guests instead of tooling.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featureList.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-[1.6rem] border border-[#0f5b4c]/10 bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,91,76,0.12)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3eee6] text-[#0f5b4c]">
                    <feature.Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-slate-950">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works" // bg-[#0f5b4c]
          className="bg-[#0f5b4c] px-4 py-20 text-[#f8f5ef] sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.36em] text-[#d6b48c]">
                How it works
              </p>
              <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">
                A streamlined path from setup to service.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {timelineSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d6b48c] text-sm font-semibold text-[#0f5b4c]">
                    0{index + 1}
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-base leading-7 text-[#f8f5ef]/80">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="insights" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-[#0f5b4c]/10 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-semibold uppercase tracking-[0.36em] text-[#0f5b4c]">
                Restaurant management
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-slate-950">
                Elegant operations for every shift.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                The dashboard keeps your team aligned without feeling noisy,
                while every action remains focused on service.
              </p>
              <Link
                href="/dashboard"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0f5b4c]"
              >
                Explore the operator view <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-[1.6rem] border border-[#0f5b4c]/10 bg-[#0f5b4c] p-7 text-[#f8f5ef] shadow-[0_20px_50px_rgba(15,91,76,0.16)]">
                <p className="text-sm uppercase tracking-[0.34em] text-[#d6b48c]">
                  QR Ordering
                </p>
                <h3 className="mt-3 text-2xl font-semibold">
                  Fast table-side ordering
                </h3>
                <p className="mt-3 text-base leading-7 text-[#f8f5ef]/80">
                  Guests order in seconds, and your team stays in control.
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-[#0f5b4c]/10 bg-[#fffdf9] p-7 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
                <p className="text-sm uppercase tracking-[0.34em] text-[#0f5b4c]">
                  Kitchen
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                  Live status without clutter
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  A focused workflow keeps prep, timing and service feeling
                  effortless.
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-[#0f5b4c]/10 bg-[#fffdf9] p-7 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:col-span-2">
                <p className="text-sm uppercase tracking-[0.34em] text-[#0f5b4c]">
                  Analytics
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                  Beautiful KPIs that guide growth
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  From peak dinner windows to top-selling dishes, every insight
                  is presented clearly and elegantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2.2rem] border border-[#0f5b4c]/10 bg-[#fffdf9] p-8 shadow-[0_20px_50px_rgba(15,23,42,0.05)] lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.36em] text-[#0f5b4c]">
                  AI features
                </p>
                <h2 className="mt-3 text-4xl font-semibold text-slate-950">
                  A thoughtful layer of intelligence.
                </h2>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                  ForkFlow learns from patterns in your service and turns them
                  into practical recommendations that feel natural, not
                  intrusive.
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-[#0f5b4c]/10 bg-[#f3eee6] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f5b4c] text-[#f8f5ef]">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-950">
                      Best pairing right now
                    </p>
                    <p className="text-sm text-slate-600">
                      High-volume dinner tables are trending toward premium
                      sides and dessert add-ons.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2.2rem] border border-[#0f5b4c]/10 bg-[#0f5b4c] p-8 text-[#f8f5ef] shadow-[0_20px_50px_rgba(15,91,76,0.16)] lg:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.36em] text-[#d6b48c]">
                  Testimonials
                </p>
                <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">
                  “The experience feels as refined as the restaurant itself.”
                </h2>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/10 px-6 py-5 text-sm leading-7 text-[#f8f5ef]/80">
                “ForkFlow made our front-of-house and kitchen feel connected for
                the first time.”
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#0f5b4c]/10 bg-[#f8f5ef] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ForkFlow. Crafted for modern
            hospitality.
          </p>
          <div className="flex flex-wrap gap-4">
            {techStack.map((tech) => (
              <span
                key={tech.name}
                className="rounded-full border border-[#0f5b4c]/10 bg-white px-3 py-1 text-slate-700"
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
