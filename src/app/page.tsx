import TextMarquee from "@/components/marquee";
import Testimonials from "@/components/testimonial";
import SiteLayout from "@/layouts/site";
import { 
  HeroHome, 
  Why, 
  GlobalTransfers,
  VirtualAccounts, 
  VirtualCards, 
  YieldVaults,
  OperatingFrontiers,
  Features, 
  Audiences, 
  Stats, 
  FAQ, 
  CTA 
} from "@/views/site/home";

export default function Home() {
  return (
    <SiteLayout>
      <div className="overflow-hidden w-full relative">
        {/* 1. Hero & Live Product UI */}
        <HeroHome />

        {/* 2. Fast-Moving High-Contrast Trust Ticker */}
        <TextMarquee direction="left" speed={30} />

        {/* 3. Problem vs Solution Comparison Matrix */}
        <Why />

        {/* 4. Core Product Pillar: Global Fiat & Stablecoin Payouts */}
        <GlobalTransfers />

        {/* 5. Core Product Pillar: Named Virtual Bank Accounts (USD, EUR, GBP) */}
        <VirtualAccounts />

        {/* 6. Core Product Pillar: Instant Visa Debit & Virtual Cards */}
        <VirtualCards />

        {/* 7. Core Product Pillar: Smart Savings & High-Yield Interest */}
        <YieldVaults />

        {/* 8. Global Liquidity Network & Frontier Corridors */}
        <OperatingFrontiers />

        {/* 9. All-in-One Capabilities Bento Grid */}
        <Features />

        {/* 10. Audience Solutions (Individuals, Businesses, Institutions) */}
        <Audiences />

        {/* 11. Institutional Scale & Metrics */}
        <Stats />

        {/* 12. Social Proof & Customer Stories */}
        <Testimonials />

        {/* 13. FAQ & Objection Handling */}
        <FAQ />

        {/* 14. Final High-Impact Conversion CTA */}
        <CTA />
      </div>
    </SiteLayout>
  );
}
