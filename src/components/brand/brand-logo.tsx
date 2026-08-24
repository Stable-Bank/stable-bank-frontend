import React from "react";
import { cn } from "@/utils/cn";

interface BrandLogoProps {
  className?: string;
  height?: number;
  variant?: "dark" | "light";
  showText?: boolean;
}

export default function BrandLogo({
  className,
  variant = "dark",
  showText = true,
}: BrandLogoProps) {
  const isLight = variant === "light";

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none group", className)}>
      {/* Geometric "S" Brand Mark */}
      <svg
        viewBox="0 0 43 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 sm:h-7 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="brandLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B0BE19" />
            <stop offset="60%" stopColor="#4649D6" />
            <stop offset="100%" stopColor="#3134B8" />
          </linearGradient>
        </defs>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M32.4028 0.00162925C37.7515 -0.00677696 42.153 0.0184417 42.1865 0.0520665C42.22 0.0856913 41.6499 1.28778 39.5792 5.33117L18.3183 5.41523L17.6895 5.71785C17.3374 5.89438 16.8763 6.20541 16.6331 6.43238C16.3984 6.65935 16.0211 7.16372 15.7948 7.55881C15.5684 7.9455 15.2163 8.44146 15.0067 8.65162C14.7971 8.87018 14.4366 9.14758 14.2103 9.28208C13.9755 9.41658 13.548 9.59311 13.2462 9.67717C12.7599 9.81167 12.2904 9.82849 8.90343 9.82849C5.92723 9.82849 5.11402 9.80327 5.11402 9.72761C5.11402 9.66877 5.69249 8.48349 7.67942 4.57461L12.1563 4.52417C15.996 4.49054 16.7002 4.45692 17.0607 4.33923C17.2871 4.26358 17.6643 4.10386 17.8991 3.96936C18.1254 3.84327 18.4943 3.56586 18.7039 3.35571C18.9135 3.14555 19.274 2.65799 19.5004 2.2629C19.7267 1.87621 20.0788 1.38025 20.2884 1.17009C20.498 0.959937 20.8417 0.690938 21.0429 0.573251C21.2525 0.455564 21.613 0.304253 21.8562 0.237003C22.0993 0.161347 22.3843 0.0856913 22.4849 0.0604727C22.5939 0.0352541 27.054 0.0100355 32.4028 0.00162925ZM33.2411 10.1647C35.3119 10.1647 37.0389 10.19 37.0725 10.2236C37.106 10.2656 36.5443 11.4509 34.4987 15.4606H30.4494C28.0852 15.4606 26.1402 15.4943 25.7545 15.5531C25.3773 15.6036 24.891 15.7381 24.5808 15.8894C24.2958 16.0239 23.8515 16.3349 23.5916 16.5703C23.3317 16.8225 22.9125 17.3604 22.6442 17.8144C22.3676 18.2683 21.9819 18.7727 21.7472 18.9744C21.5208 19.1762 21.11 19.4452 20.8333 19.5797C20.5567 19.7142 20.104 19.8571 19.8273 19.9075C19.4836 19.9748 16.2726 20 9.65796 20C1.98692 20 0 19.9748 0 19.8907C0 19.8403 0.595238 18.6298 2.64085 14.62L23.8515 14.578L24.497 14.2586C24.9078 14.0652 25.3186 13.7878 25.5953 13.502C25.8384 13.2666 26.2073 12.7623 26.4252 12.3924C26.6516 11.9889 27.0037 11.5349 27.2971 11.2575C27.5738 11.0054 27.9594 10.7111 28.169 10.6103C28.3786 10.5094 28.7559 10.3665 29.0074 10.2992C29.3763 10.1984 30.2063 10.1731 33.2411 10.1647Z"
          fill="url(#brandLogoGrad)"
        />
      </svg>

      {/* Prominent High-Contrast Text Wordmark */}
      {showText && (
        <span
          className={cn(
            "text-xl sm:text-2xl font-display font-extrabold tracking-tight leading-none flex items-center",
            isLight ? "text-white" : "text-zinc-950"
          )}
        >
          <span>Stable</span>
          <span className="text-brand-purple">Bank</span>
          <span className="inline-block h-2 w-2 rounded-full bg-[#B0BE19] ml-1 self-center shadow-xs" />
        </span>
      )}
    </div>
  );
}
