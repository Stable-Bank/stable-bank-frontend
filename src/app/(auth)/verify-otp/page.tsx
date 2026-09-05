"use client";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/config/axios";
import { appRoutes } from "@/lib/navigation";
import { ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { OtpInput } from "@/components/ui/otp-input";

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!email) {
      router.push(appRoutes.auth.signUp);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [email, router]);

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      setLoading(false);
      return;
    }

    try {
      await apiClient.post("/auth/verify-otp", {
        email,
        otp,
      });

      toast.success("Email verified successfully! You can now sign in.");
      router.push(appRoutes.auth.signIn);
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Verification failed. Please try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (timer > 0) return;

    try {
      await apiClient.post("/auth/send-otp", { email });
      setTimer(60);
      toast.success("New OTP sent to your email.");
    } catch {
      toast.error("Failed to resend OTP.");
    }
  }

  return (
    <div className="flex w-full flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-2.5 sm:gap-3 text-left">
        <div className="flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100/90 px-3.5 py-1.5 font-mono text-xs font-semibold text-zinc-800 uppercase tracking-wider shadow-xs">
          <ShieldCheck size={14} className="text-brand-purple" />
          <span>Security Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-zinc-950 tracking-tight">
          Check your <span className="text-brand-purple">inbox.</span>
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base font-sans">
          Enter the 6-digit security verification code sent to your email.
        </p>
      </div>

      <div className="w-full rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 p-5 sm:p-7 md:p-8 shadow-sm">
        <form onSubmit={handleVerify} className="flex flex-col gap-5 sm:gap-6">
          <div className="flex items-center gap-2.5 rounded-xl bg-zinc-50 border border-zinc-200/90 px-3.5 py-2.5 text-xs sm:text-sm">
            <span className="truncate font-medium text-zinc-700">
              Code sent to <strong className="text-zinc-950 font-semibold font-mono">{email}</strong>
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl bg-zinc-50/70 border border-zinc-200/80 p-4 sm:p-6">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Verification Code
            </span>
            <div className="w-full flex justify-center py-2">
              <OtpInput 
                value={otp} 
                onChange={setOtp} 
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-3 text-xs sm:text-sm font-sans">
              <span className="text-zinc-500">Didn&apos;t receive it?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0 || loading}
                className={cn(
                  "font-bold transition-colors cursor-pointer",
                  timer > 0 ? "text-zinc-400 cursor-not-allowed" : "text-brand-purple hover:text-brand-purple/80 underline underline-offset-4"
                )}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend code"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <Button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full text-white bg-brand-purple hover:bg-brand-purple/90 h-11 sm:h-12 rounded-full text-sm sm:text-base font-bold transition-all active:scale-[0.98] shadow-md shadow-brand-purple/20 cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify Identity"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

