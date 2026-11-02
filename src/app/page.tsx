import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { JourneySection } from "@/components/landing/JourneySection";
import { FoundationsSection } from "@/components/landing/FoundationsSection";
import { ProductInActionSection } from "@/components/landing/ProductInActionSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#101712] text-[#17211A] dark:text-[#F5F6EF] font-sans selection:bg-[#E5483F]/20 dark:selection:bg-[#FF6558]/30 transition-colors duration-300">
      {/* 1. Navbar */}
      <LandingNav />

      {/* 2. Main Page Sections matching the Reference Image */}
      <main id="main-content">
        {/* Hero Section & Docked Modules Bar */}
        <HeroSection />

        {/* The Restaurant Journey */}
        <JourneySection />

        {/* The Foundations of Service */}
        <FoundationsSection />

        {/* ForkFlow in Action */}
        <ProductInActionSection />
      </main>

      {/* 3. Footer */}
      <LandingFooter />
    </div>
  );
}
