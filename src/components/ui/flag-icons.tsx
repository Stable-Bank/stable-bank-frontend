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

export function MultiFlagIcon({ className = "w-7 h-5" }: { className?: string }) {
  return (
    <div className={`relative flex items-center shrink-0 ${className}`}>
      <USFlagIcon className="w-4 h-4 rounded-full border border-black/40 shadow-sm z-20" />
      <UKFlagIcon className="w-4 h-4 rounded-full border border-black/40 shadow-sm -ml-2 z-10" />
      <EUFlagIcon className="w-4 h-4 rounded-full border border-black/40 shadow-sm -ml-2 z-0" />
    </div>
  );
}
