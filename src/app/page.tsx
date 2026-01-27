import TextMarquee from "@/components/marquee";
import Testimonials from "@/components/testimonial";
import SiteLayout from "@/layouts/site";
import { HeroHome, Why, Features, Stats, CTA } from "@/views/site/home";

export default function Home() {
  return (
    <SiteLayout>
      <div className="">
        <HeroHome />
        <Why />
        <TextMarquee direction="right" />
        <Features />
        <Stats />
        <Testimonials />
        <CTA />
      </div>
    </SiteLayout>
  );
}
