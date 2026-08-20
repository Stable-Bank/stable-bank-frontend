import TextMarquee from "@/components/marquee";
import Testimonials from "@/components/testimonial";
import SiteLayout from "@/layouts/site";
import { HeroHome, Why, Features, Stats, FAQ, CTA, Audiences, VirtualCards, VirtualAccounts } from "@/views/site/home";

export default function Home() {
  return (
    <SiteLayout>
      <div className="overflow-hidden w-full relative">
        <HeroHome />
        <Why />
        <Audiences />
        <TextMarquee direction="right" />
        <Features />
        <VirtualAccounts />
        <VirtualCards />
        <Stats />
        <Testimonials />
        <FAQ />
        <CTA />
      </div>
    </SiteLayout>
  );
}

