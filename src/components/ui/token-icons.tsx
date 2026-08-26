"use client";

import React from "react";

interface TokenIconProps {
  className?: string;
  size?: number;
}

// 1. USDC (USD Coin by Circle)
export function USDCIcon({ className = "w-6 h-6", size = 24 }: TokenIconProps) {
  return (
    <svg className={`rounded-full shrink-0 ${className}`} width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#2775CA" />
      <path
        d="M16 4.8C9.81 4.8 4.8 9.81 4.8 16C4.8 22.19 9.81 27.2 16 27.2C22.19 27.2 27.2 22.19 27.2 16C27.2 9.81 22.19 4.8 16 4.8ZM16 25.45C10.78 25.45 6.55 21.22 6.55 16C6.55 10.78 10.78 6.55 16 6.55C21.22 6.55 25.45 10.78 25.45 16C25.45 21.22 21.22 25.45 16 25.45Z"
        fill="white"
        fillOpacity="0.4"
      />
      <path
        d="M17.4 13.9C15.8 13.5 15.3 13.1 15.3 12.3C15.3 11.4 16.1 10.8 17.2 10.8C18.2 10.8 19 11.2 19.3 11.9C19.4 12.1 19.6 12.2 19.8 12.2H21C21.3 12.2 21.5 12 21.4 11.7C20.9 10.2 19.5 9.2 17.9 9.1V7.8C17.9 7.5 17.7 7.3 17.4 7.3H16.2C15.9 7.3 15.7 7.5 15.7 7.8V9.1C13.8 9.4 12.5 10.7 12.5 12.4C12.5 14.4 13.8 15.3 16 15.8C17.7 16.2 18.2 16.8 18.2 17.6C18.2 18.6 17.2 19.2 16 19.2C14.7 19.2 13.8 18.6 13.3 17.7C13.2 17.5 13 17.4 12.8 17.4H11.5C11.2 17.4 11 17.6 11.1 17.9C11.7 19.7 13.4 20.7 15.5 20.9V22.2C15.5 22.5 15.7 22.7 16 22.7H17.2C17.5 22.7 17.7 22.5 17.7 22.2V20.9C19.7 20.6 21 19.2 21 17.4C21.1 15.1 19.4 14.3 17.4 13.9Z"
        fill="white"
      />
    </svg>
  );
}

// 2. USDT (Tether USD)
export function USDTIcon({ className = "w-6 h-6", size = 24 }: TokenIconProps) {
  return (
    <svg className={`rounded-full shrink-0 ${className}`} width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#26A17B" />
      <path
        d="M17.9 14.8V12.9H23.5V9.7H8.5V12.9H14.1V14.8C9.5 15 6 16.1 6 17.5C6 18.9 9.5 20 14.1 20.2V25.3H17.9V20.2C22.5 20 26 18.9 26 17.5C26 16.1 22.5 15 17.9 14.8ZM16 19.3C12.3 19.3 9.3 18.5 9.3 17.5C9.3 16.5 12.3 15.7 16 15.7C19.7 15.7 22.7 16.5 22.7 17.5C22.7 18.5 19.7 19.3 16 19.3Z"
        fill="white"
      />
    </svg>
  );
}

// 3. EURC (Circle Euro Coin)
export function EURCIcon({ className = "w-6 h-6", size = 24 }: TokenIconProps) {
  return (
    <svg className={`rounded-full shrink-0 ${className}`} width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#1C3879" />
      <path
        d="M16 4.8C9.81 4.8 4.8 9.81 4.8 16C4.8 22.19 9.81 27.2 16 27.2C22.19 27.2 27.2 22.19 27.2 16C27.2 9.81 22.19 4.8 16 4.8ZM16 25.45C10.78 25.45 6.55 21.22 6.55 16C6.55 10.78 10.78 6.55 16 6.55C21.22 6.55 25.45 10.78 25.45 16C25.45 21.22 21.22 25.45 16 25.45Z"
        fill="white"
        fillOpacity="0.4"
      />
      {/* Euro Symbol */}
      <path
        d="M18.8 10.2C15.6 10.2 13.1 12.2 12.4 14.8H11V16.4H12.1C12.1 16.8 12.1 17.2 12.1 17.6H11V19.2H12.4C13.1 21.8 15.6 23.8 18.8 23.8C20.6 23.8 22.2 23 23.2 21.8L21.8 20.4C21.1 21.2 20 21.8 18.8 21.8C16.8 21.8 15.1 20.4 14.6 18.4H21V16.8H14.3C14.3 16.4 14.3 16 14.3 15.6H21V14H14.6C15.1 12 16.8 10.6 18.8 10.6C20 10.6 21.1 11.2 21.8 12L23.2 10.6C22.2 9.4 20.6 10.2 18.8 10.2Z"
        fill="#FFD700"
      />
    </svg>
  );
}

// 4. PYUSD (PayPal USD)
export function PYUSDIcon({ className = "w-6 h-6", size = 24 }: TokenIconProps) {
  return (
    <svg className={`rounded-full shrink-0 ${className}`} width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#0079C1" />
      {/* Dual P's */}
      <path
        d="M12.5 7.5H18C20.5 7.5 22.2 8.7 21.8 11.2C21.4 13.7 19.3 15.2 16.8 15.2H14.5L13.2 23.5H10L12.5 7.5Z"
        fill="#00457C"
      />
      <path
        d="M15 11.5H19.5C21.5 11.5 22.8 12.5 22.5 14.5C22.1 16.5 20.4 17.7 18.4 17.7H16.5L15.4 24.5H13L15 11.5Z"
        fill="#0079C1"
      />
      <path
        d="M15.5 11.5H20C22.2 11.5 23.5 12.5 23.2 14.5C22.8 16.5 21 17.7 18.8 17.7H17L16 24.5H13.5L15.5 11.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// 5. DAI (Sky / MakerDAO)
export function DAIIcon({ className = "w-6 h-6", size = 24 }: TokenIconProps) {
  return (
    <svg className={`rounded-full shrink-0 ${className}`} width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#F4B731" />
      {/* DAI double bar */}
      <path
        d="M10 8.5H17C21.1 8.5 24 11.4 24 16C24 20.6 21.1 23.5 17 23.5H10V8.5ZM12.8 11.2V13.8H21.5C21.1 12.7 20.3 11.8 19.2 11.2H12.8ZM22.4 15H12.8V17H22.4C22.5 16.7 22.5 16.3 22.5 16C22.5 15.7 22.5 15.3 22.4 15ZM12.8 18.2V20.8H19.2C20.3 20.2 21.1 19.3 21.5 18.2H12.8Z"
        fill="white"
      />
    </svg>
  );
}

// 6. USDb (Bridge Sovereign USD)
export function USDBIcon({ className = "w-6 h-6", size = 24 }: TokenIconProps) {
  return (
    <svg className={`rounded-full shrink-0 ${className}`} width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="usdbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#usdbGrad)" />
      <path
        d="M10 9H16C19.3 9 22 11.7 22 16C22 20.3 19.3 23 16 23H10V9Z"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="16" cy="16" r="3.5" fill="#B0BE19" />
    </svg>
  );
}

// 7. cNGN (Compliant Nigerian Naira)
export function CNGNIcon({ className = "w-6 h-6", size = 24 }: TokenIconProps) {
  return (
    <svg className={`rounded-full shrink-0 ${className}`} width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#008751" />
      <path
        d="M10 9V23M10 9L22 23M22 9V23M7.5 14H24.5M7.5 18H24.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 8. BRLA (Brazilian Real Stablecoin)
export function BRLAIcon({ className = "w-6 h-6", size = 24 }: TokenIconProps) {
  return (
    <svg className={`rounded-full shrink-0 ${className}`} width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#009739" />
      <polygon points="16,6 26,16 16,26 6,16" fill="#FEDD00" />
      <text x="16" y="19.5" textAnchor="middle" fill="#012169" fontSize="9" fontWeight="900" fontFamily="sans-serif">
        R$
      </text>
    </svg>
  );
}

// 9. ZARP (South African Rand Stablecoin)
export function ZARPIcon({ className = "w-6 h-6", size = 24 }: TokenIconProps) {
  return (
    <svg className={`rounded-full shrink-0 ${className}`} width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#0B7A75" />
      <path
        d="M10 10H22L11 22H23"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21" cy="11" r="1.5" fill="#FFB81C" />
    </svg>
  );
}

// 10. NTZS (Tanzanian Shilling Token)
export function NTZSIcon({ className = "w-6 h-6", size = 24 }: TokenIconProps) {
  return (
    <svg className={`rounded-full shrink-0 ${className}`} width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#00A3E0" />
      <path d="M6 6L26 26" stroke="#000000" strokeWidth="4" />
      <path d="M6 6L26 26" stroke="#FCD116" strokeWidth="2" />
      <text x="16" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace">
        TZS
      </text>
    </svg>
  );
}

// 11. KESX (Kenyan Shilling Token)
export function KESXIcon({ className = "w-6 h-6", size = 24 }: TokenIconProps) {
  return (
    <svg className={`rounded-full shrink-0 ${className}`} width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#990000" />
      <circle cx="16" cy="16" r="10" stroke="#006600" strokeWidth="2" fill="none" />
      <text x="16" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace">
        KSh
      </text>
    </svg>
  );
}

// 12. EGPX (Egyptian Pound Token)
export function EGPXIcon({ className = "w-6 h-6", size = 24 }: TokenIconProps) {
  return (
    <svg className={`rounded-full shrink-0 ${className}`} width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#CE1126" />
      <circle cx="16" cy="16" r="10" stroke="#C09A3E" strokeWidth="2" fill="#000000" />
      <text x="16" y="19" textAnchor="middle" fill="#C09A3E" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
        E£
      </text>
    </svg>
  );
}

// 13. GHSX (Ghanaian Cedi Token)
export function GHSXIcon({ className = "w-6 h-6", size = 24 }: TokenIconProps) {
  return (
    <svg className={`rounded-full shrink-0 ${className}`} width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#FCD116" />
      <circle cx="16" cy="16" r="10" fill="#CF1126" />
      <text x="16" y="19.5" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace">
        GH₵
      </text>
    </svg>
  );
}
