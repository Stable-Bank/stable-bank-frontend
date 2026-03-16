"use client";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/config/axios";
import { appRoutes } from "@/lib/navigation";
import { MoveRight, ShieldCheck } from "lucide-react";
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
    } catch (error: any) {
      toast.error("Failed to resend OTP.");
    }
  }

  return (
    <form onSubmit={handleVerify} className="flex w-full flex-col gap-6 sm:gap-8">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex w-fit items-center gap-2.5 rounded-full bg-white/5 border border-white/10 py-1.5 px-4 text-xs sm:text-sm font-medium backdrop-blur-md">
          <ShieldCheck size={14} className="text-brand-purple" />
          <span>Security Verification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Check your <span className="text-brand-purple">inbox.</span>
        </h1>
        <p className="text-white/50 text-sm sm:text-base leading-relaxed">
          We&apos;ve sent a 6-digit security code to <span className="text-white font-semibold underline decoration-brand-purple/30 underline-offset-4">{email}</span>. Please enter it below.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="py-4">
          <OtpInput 
            value={otp} 
            onChange={setOtp} 
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="text-white bg-brand-purple hover:bg-brand-purple/90 h-12 sm:h-14 rounded-2xl text-base font-bold transition-all active:scale-[0.98] shadow-lg shadow-brand-purple/20"
          >
            {loading ? "Verifying..." : "Verify Identity"}
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-white/40">Didn&apos;t receive it?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0}
              className={cn(
                "font-bold transition-colors",
                timer > 0 ? "text-white/20 cursor-not-allowed" : "text-brand-purple hover:text-brand-purple/80 underline underline-offset-4"
              )}
            >
              Resend Code {timer > 0 && <span className="font-mono text-white/40 text-xs ml-1">({timer}s)</span>}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

