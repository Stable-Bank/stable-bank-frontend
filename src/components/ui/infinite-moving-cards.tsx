"use client";

import { cn } from "@/utils/cn";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
    image: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] font-sans",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-5 p-1",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[320px] sm:w-[380px] md:w-[420px] max-w-full shrink-0 rounded-2xl bg-white border border-zinc-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow"
            key={item.name + idx}
          >
            <blockquote className="flex flex-col justify-between h-full">
              <span className="relative z-20 text-sm sm:text-base leading-relaxed font-sans text-zinc-700">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center gap-3.5 pt-4 border-t border-zinc-100">
                <Image
                  src={item.image}
                  alt="user"
                  width={42}
                  height={42}
                  className="rounded-full ring-2 ring-brand-purple/20"
                />

                <span className="flex flex-col">
                  <span className="text-sm font-sans font-bold text-zinc-950">
                    {item.name}
                  </span>
                  <span className="text-xs font-sans text-zinc-500">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
