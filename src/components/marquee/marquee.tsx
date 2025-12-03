import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";

export default function TextMarquee({
  direction = "left",
  speed,
}: {
  direction?: "left" | "right";
  speed?: number;
}) {
  return (
    <Marquee
      autoFill={true}
      pauseOnHover={true}
      direction={direction}
      speed={speed}
      className="cursor-pointer"
    >
      {marqueeItems.map((item, index) => (
        <div key={index} className="mx-4 sm:mx-6 md:mx-8 flex items-center gap-4 sm:gap-6 md:gap-8">
          <Image
            src={"/images/svg/star.svg"}
            alt="star"
            width={10}
            height={10}
            className="w-2 h-2 sm:w-2.5 sm:h-2.5"
          />
          <span className="text-brand-white text-sm sm:text-base md:text-lg font-semibold">{item}</span>
        </div>
      ))}
    </Marquee>
  );
}

const marqueeItems = [
  "SEND",
  "RECEIVE",
  "WALLET",
  "VIRTUAL CARD",
  "ONE BANK",
  "STORE STABLES",
  "SEND",
  "RECEIVE",
  "WALLET",
  "VIRTUAL CARD",
];
