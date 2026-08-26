"use client";

import React from "react";
import Marquee from "react-fast-marquee";

export default function TextMarquee({
  direction = "left",
  speed = 35,
}: {
  direction?: "left" | "right";
  speed?: number;
}) {
  return (
    <div className="w-full bg-zinc-950 py-3 sm:py-4 border-y border-zinc-800/80 overflow-hidden select-none my-6 sm:my-10">
      <Marquee
        autoFill={true}
        pauseOnHover={true}
        direction={direction}
        speed={speed}
        className="cursor-default"
      >
        {marqueeItems.map((item, index) => (
          <div key={index} className="mx-4 sm:mx-8 flex items-center gap-3 sm:gap-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B0BE19] shadow-[0_0_8px_#B0BE19] shrink-0" />
            <span className="text-zinc-200 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase">
              {item}
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}

const marqueeItems = [
  "GLOBAL PAYOUTS",
  "NAMED VIRTUAL IBANS",
  "INSTANT VISA CARDS",
  "UP TO 12% FIXED YIELD",
  "SUB-SECOND FINALITY",
  "BRIDGE ORCHESTRATED",
  "ZERO HIDDEN FX SPREAD",
  "SELF-CUSTODIAL RECOVERY",
  "120+ COUNTRIES",
];
