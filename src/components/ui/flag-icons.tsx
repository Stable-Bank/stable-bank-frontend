"use client";

import React from "react";

export function USFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-us-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-us-clip)">
        <rect width="512" height="512" fill="#B22234" />
        <path d="M0 39.38h512v39.38H0zm0 78.77h512v39.38H0zm0 78.77h512v39.38H0zm0 78.77h512v39.38H0zm0 78.77h512v39.38H0zm0 78.77h512v39.38H0z" fill="#FFFFFF" />
        <rect width="210" height="275.69" fill="#3C3B6E" />
        {/* Stars */}
        <g fill="#FFFFFF">
          <circle cx="35" cy="35" r="9" />
          <circle cx="95" cy="35" r="9" />
          <circle cx="155" cy="35" r="9" />
          <circle cx="65" cy="70" r="9" />
          <circle cx="125" cy="70" r="9" />
          <circle cx="185" cy="70" r="9" />
          <circle cx="35" cy="105" r="9" />
          <circle cx="95" cy="105" r="9" />
          <circle cx="155" cy="105" r="9" />
          <circle cx="65" cy="140" r="9" />
          <circle cx="125" cy="140" r="9" />
          <circle cx="185" cy="140" r="9" />
          <circle cx="35" cy="175" r="9" />
          <circle cx="95" cy="175" r="9" />
          <circle cx="155" cy="175" r="9" />
          <circle cx="65" cy="210" r="9" />
          <circle cx="125" cy="210" r="9" />
          <circle cx="185" cy="210" r="9" />
          <circle cx="35" cy="245" r="9" />
          <circle cx="95" cy="245" r="9" />
          <circle cx="155" cy="245" r="9" />
        </g>
      </g>
    </svg>
  );
}

export function UKFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-uk-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-uk-clip)">
        <rect width="512" height="512" fill="#012169" />
        <path d="M0 0l512 512m0-512L0 512" stroke="#FFFFFF" strokeWidth="60" />
        <path d="M0 0l512 512m0-512L0 512" stroke="#C8102E" strokeWidth="36" />
        <path d="M256 0v512M0 256h512" stroke="#FFFFFF" strokeWidth="100" />
        <path d="M256 0v512M0 256h512" stroke="#C8102E" strokeWidth="60" />
      </g>
    </svg>
  );
}

export const GBFlagIcon = UKFlagIcon;

export function EUFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-eu-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-eu-clip)">
        <rect width="512" height="512" fill="#003399" />
        {/* 12 Gold Stars in circle */}
        <g fill="#FFCC00">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 256 + 140 * Math.sin(rad);
            const cy = 256 - 140 * Math.cos(rad);
            return <circle key={deg} cx={cx} cy={cy} r="14" />;
          })}
        </g>
      </g>
    </svg>
  );
}

export function NGFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-ng-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-ng-clip)">
        <rect width="512" height="512" fill="#008751" />
        <rect x="170.66" width="170.66" height="512" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

export function TZFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-tz-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-tz-clip)">
        <path d="M0 0l512 512H0V0z" fill="#00A3E0" />
        <path d="M0 0l512 512V0H0z" fill="#1EB53A" />
        <path d="M0 512L512 0" stroke="#FCD116" strokeWidth="160" />
        <path d="M0 512L512 0" stroke="#000000" strokeWidth="100" />
      </g>
    </svg>
  );
}

export function CAFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-ca-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-ca-clip)">
        <rect width="512" height="512" fill="#FFFFFF" />
        <rect width="128" height="512" fill="#FF0000" />
        <rect x="384" width="128" height="512" fill="#FF0000" />
        <path d="M256 120l18 55 35-15-10 40 45-5-20 40 30 20-55 20 15 50-48-25-10 65h-10l-10-65-48 25 15-50-55-20 30-20-20-40 45 5-10-40 35 15z" fill="#FF0000" />
      </g>
    </svg>
  );
}

export function UYFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-uy-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-uy-clip)">
        <rect width="512" height="512" fill="#FFFFFF" />
        <path d="M0 56.88h512v56.88H0zm0 113.76h512v56.88H0zm0 113.76h512v56.88H0zm0 113.76h512v56.88H0z" fill="#0038A8" />
        <rect width="210" height="227.5" fill="#FFFFFF" />
        <circle cx="105" cy="113.75" r="45" fill="#FCD116" stroke="#9E7E00" strokeWidth="4" />
      </g>
    </svg>
  );
}

export function JPFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-jp-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-jp-clip)">
        <rect width="512" height="512" fill="#FFFFFF" />
        <circle cx="256" cy="256" r="150" fill="#BC002D" />
      </g>
    </svg>
  );
}

export function KEFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-ke-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-ke-clip)">
        <rect width="512" height="150" fill="#000000" />
        <rect y="150" width="512" height="212" fill="#FFFFFF" />
        <rect y="170" width="512" height="172" fill="#990000" />
        <rect y="362" width="512" height="150" fill="#006600" />
        <ellipse cx="256" cy="256" rx="45" ry="90" fill="#990000" stroke="#FFFFFF" strokeWidth="8" />
        <circle cx="256" cy="256" r="16" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

export function ZAFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-za-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-za-clip)">
        <path d="M0 0h512v256H0z" fill="#E03C31" />
        <path d="M0 256h512v256H0z" fill="#001489" />
        <path d="M0 0l256 256L0 512z" fill="#000000" />
        <path d="M0 0l256 256L0 512h70l220-220H512v-72H290L70 0z" fill="#FFB81C" />
        <path d="M0 30l226 226L0 482h40l200-200H512v-52H240L40 30z" fill="#007749" stroke="#FFFFFF" strokeWidth="12" />
      </g>
    </svg>
  );
}

export function BRFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-br-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-br-clip)">
        <rect width="512" height="512" fill="#009739" />
        <polygon points="256,40 480,256 256,472 32,256" fill="#FEDD00" />
        <circle cx="256" cy="256" r="110" fill="#012169" />
        <path d="M150 280c50-30 150-30 210 0" stroke="#FFFFFF" strokeWidth="16" fill="none" />
      </g>
    </svg>
  );
}

export function GHFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-gh-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-gh-clip)">
        <rect width="512" height="170.66" fill="#CF1126" />
        <rect y="170.66" width="512" height="170.66" fill="#FCD116" />
        <rect y="341.33" width="512" height="170.66" fill="#006B3F" />
        <polygon points="256,190 274,242 330,242 284,275 302,328 256,295 210,328 228,275 182,242 238,242" fill="#000000" />
      </g>
    </svg>
  );
}

export function EGFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-eg-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-eg-clip)">
        <rect width="512" height="170.66" fill="#CE1126" />
        <rect y="170.66" width="512" height="170.66" fill="#FFFFFF" />
        <rect y="341.33" width="512" height="170.66" fill="#000000" />
        <circle cx="256" cy="256" r="32" fill="#C09A3E" />
      </g>
    </svg>
  );
}

export function CHFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-ch-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-ch-clip)">
        <rect width="512" height="512" fill="#D52B1E" />
        <rect x="216" y="116" width="80" height="280" fill="#FFFFFF" />
        <rect x="116" y="216" width="280" height="80" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

export function AEFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-ae-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-ae-clip)">
        <rect width="512" height="170.66" fill="#00732F" />
        <rect y="170.66" width="512" height="170.66" fill="#FFFFFF" />
        <rect y="341.33" width="512" height="170.66" fill="#000000" />
        <rect width="140" height="512" fill="#FF0000" />
      </g>
    </svg>
  );
}

export function MXFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-mx-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-mx-clip)">
        <rect width="170.66" height="512" fill="#006847" />
        <rect x="170.66" width="170.66" height="512" fill="#FFFFFF" />
        <rect x="341.33" width="170.66" height="512" fill="#CE1126" />
        <circle cx="256" cy="256" r="28" fill="#8B5A2B" />
      </g>
    </svg>
  );
}

export function COFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`rounded-full shrink-0 shadow-sm ${className}`} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sb-co-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath="url(#sb-co-clip)">
        <rect width="512" height="256" fill="#FCD116" />
        <rect y="256" width="512" height="128" fill="#003893" />
        <rect y="384" width="512" height="128" fill="#CE1126" />
      </g>
    </svg>
  );
}

export function MultiFlagIcon({ className = "w-7 h-5" }: { className?: string }) {
  return (
    <div className={`relative flex items-center shrink-0 ${className}`}>
      <USFlagIcon className="w-4 h-4 rounded-full border border-black/40 shadow-sm z-20" />
      <UKFlagIcon className="w-4 h-4 rounded-full border border-black/40 shadow-sm -ml-2 z-10" />
      <EUFlagIcon className="w-4 h-4 rounded-full border border-black/40 shadow-sm -ml-2 z-0" />
    </div>
  );
}
