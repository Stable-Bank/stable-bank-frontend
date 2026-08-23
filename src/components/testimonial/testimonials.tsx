import React from "react";
import { SectionCard } from "../cards";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export default function Testimonials() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 md:gap-[72px] px-4 sm:px-6 lg:px-10 pb-10 sm:pb-16 md:pb-20 pt-10">
      <div className="mx-auto flex w-full max-w-[544px] flex-col items-center gap-4 sm:gap-5 text-center">
        <SectionCard title="Testimonial" category="COMMUNITY" />
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-zinc-950">
          Trusted by <span className="text-brand-purple">Innovators</span>
        </h2>
        <p className="text-base sm:text-lg text-zinc-600 font-sans leading-relaxed">
          Secure your digital assets with the peace of mind that comes from
          knowing you are protected by the best technology in the blockchain
          space.
        </p>
      </div>

      <div className="flex w-full flex-col gap-5">
        <InfiniteMovingCards items={dummyData} speed="slow" />
        <InfiniteMovingCards items={dummyData} speed="slow" direction="right" />
      </div>
    </div>
  );
}

const dummyData = [
  {
    name: "Guy Hawkins",
    quote:
      "“AI streamlines international client coordination by scheduling emails for optimal inbox timing.”",
    title: "Co founder",
    image: "/images/placeholder/dummy-profile-img.png",
  },
  {
    name: "Guy Hawkins",
    quote:
      "“AI streamlines international client coordination by scheduling emails for optimal inbox timing.”",
    title: "Co founder",
    image: "/images/placeholder/dummy-profile-img.png",
  },
  {
    name: "Guy Hawkins",
    quote:
      "“AI streamlines international client coordination by scheduling emails for optimal inbox timing.”",
    title: "Co founder",
    image: "/images/placeholder/dummy-profile-img.png",
  },
  {
    name: "Guy Hawkins",
    quote:
      "“AI streamlines international client coordination by scheduling emails for optimal inbox timing.”",
    title: "Co founder",
    image: "/images/placeholder/dummy-profile-img.png",
  },
  {
    name: "Guy Hawkins",
    quote:
      "“AI streamlines international client coordination by scheduling emails for optimal inbox timing.”",
    title: "Co founder",
    image: "/images/placeholder/dummy-profile-img.png",
  },
];
