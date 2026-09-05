"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  className?: string;
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  className,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Sync internal state with prop value (e.g. on reset or initial load)
  useEffect(() => {
    const newOtp = value.split("").slice(0, length);
    const paddedOtp = [...newOtp, ...new Array(length - newOtp.length).fill("")];
    setOtp(paddedOtp);
  }, [value, length]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are entered (shouldn't happen with max length 1)
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Move to next input if value is entered
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim();
    if (isNaN(Number(data))) return;

    const pastedData = data.split("").slice(0, length);
    const newOtp = [...otp];
    pastedData.forEach((char, i) => {
      if (i < length) newOtp[i] = char;
    });
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Focus last pasted index or last input
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className={cn("flex justify-center items-center gap-2 sm:gap-3", className)}>
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          disabled={disabled}
          ref={(el) => {
            if (el) inputRefs.current[index] = el;
          }}
          onFocus={(e) => e.target.select()}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            "h-13 w-10 min-[375px]:w-11 sm:h-16 sm:w-13 md:h-16 md:w-14 rounded-xl sm:rounded-2xl border-2 text-center text-2xl sm:text-3xl font-mono font-bold transition-all duration-150 outline-none shadow-xs select-none",
            "bg-white text-zinc-950 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50",
            "focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/15 focus:bg-white focus:text-zinc-950",
            "dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:hover:border-zinc-600 dark:focus:border-brand-purple dark:focus:ring-brand-purple/30 dark:focus:bg-zinc-800",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:disabled:bg-zinc-800",
            digit
              ? "border-brand-purple bg-brand-purple/[0.05] text-brand-purple font-extrabold shadow-sm dark:bg-brand-purple/10 dark:text-purple-300"
              : ""
          )}
        />
      ))}
    </div>
  );
}
