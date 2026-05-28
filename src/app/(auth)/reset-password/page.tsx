"use client";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/config/axios";
import { appRoutes } from "@/lib/navigation";
import { passwordSchema } from "@/schema/password";
import { MoveRight, LockKeyhole } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { OtpInput } from "@/components/ui/otp-input";
import { cn } from "@/lib/utils";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [step, setStep] = useState(1); // 1: OTP, 2: New Password
  const [resetData, setResetData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
    loading: false,
  });

  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  function updateResetData<K extends keyof typeof resetData>(
    field: K,
    value: (typeof resetData)[K]
  ) {
    setResetData((prev) => ({ ...prev, [field]: value }));
  }

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    try {
      await apiClient.post("/auth/forgot-password", { email });
      toast.success("Security code resent to your email.");
      setResendTimer(60);
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Failed to resend code.";
      toast.error(errMsg);
    }
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetData.otp.length !== 6) {
      toast.error("Please enter the 6-digit code sent to your email.");
      return;
    }

    updateResetData("loading", true);
    try {
      await apiClient.post("/auth/verify-reset-code", {
        email,
        otp: resetData.otp,
      });
      setStep(2);
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Invalid or expired code.";
      toast.error(errMsg);
    } finally {
      updateResetData("loading", false);
    }
  };

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (resetData.password !== resetData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const validPassword = passwordSchema.safeParse(resetData.password);
    if (!validPassword.success) {
      toast.error(validPassword.error.issues.map((e) => e.message).join(" "));
      return;
    }

    updateResetData("loading", true);

    try {
      await apiClient.post("/auth/reset-password", {
        email,
        otp: resetData.otp,
        password: validPassword.data,
      });

      toast.success("Password reset successfully! Please sign in.");
      router.push(appRoutes.auth.signIn);
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Reset failed. Please try again.";
      toast.error(errMsg);
      // If the OTP is invalid, we might want to go back to step 1
      if (errMsg.toLowerCase().includes("otp")) {
        setStep(1);
      }
    } finally {
      updateResetData("loading", false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex w-fit items-center gap-2.5 rounded-full bg-white/5 border border-white/10 py-1.5 px-4 text-sm sm:text-sm font-medium backdrop-blur-md">
          <LockKeyhole size={14} className="text-brand-purple" />
          <span>{step === 1 ? "Identity Verification" : "Security Setup"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          {step === 1 ? (
            <>Check your <span className="text-brand-purple">inbox.</span></>
          ) : (
            <>Secure your <span className="text-brand-purple">account.</span></>
          )}
        </h1>
        <p className="text-white/50 text-sm sm:text-base leading-relaxed">
          {step === 1 ? (
            <>We&apos;ve sent a 6-digit security code to <span className="text-white font-semibold underline decoration-brand-purple/30 underline-offset-4">{email}</span></>
          ) : (
            "Create a new strong password to protect your funds."
          )}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleNextStep} className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="py-4">
              <OtpInput 
                value={resetData.otp} 
                onChange={(val) => updateResetData("otp", val)} 
                disabled={resetData.loading}
              />
            </div>
            
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendTimer > 0}
                className={cn(
                  "text-sm font-medium transition-all",
                  resendTimer > 0 
                  ? "text-white/20 cursor-not-allowed" 
                  : "text-brand-purple hover:text-brand-purple/80 underline underline-offset-4"
                )}
              >
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Didn't receive code? Resend"}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={resetData.otp.length !== 6 || resetData.loading}
              className="text-white bg-brand-purple hover:bg-brand-purple/90 h-12 sm:h-14 rounded-2xl text-base font-bold transition-all active:scale-[0.98] shadow-lg shadow-brand-purple/20"
            >
              {resetData.loading ? "Verifying code..." : "Continue to Password"}
            </Button>
            <button 
              type="button"
              onClick={() => router.back()}
              className="text-sm text-white/40 hover:text-white transition-colors text-center"
            >
              Wrong email? Go back
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleReset} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="group relative h-12 sm:h-14 rounded-2xl bg-white/5 border border-white/10 focus-within:border-brand-purple/50 focus-within:bg-white/10 transition-all">
              <input
                type="password"
                autoFocus
                value={resetData.password}
                onChange={(e) => updateResetData("password", e.target.value)}
                placeholder="New Password"
                className="hide-autofill h-full w-full rounded-2xl border-0 bg-inherit px-5 text-sm sm:text-base text-white ring-0 outline-0"
              />
            </div>
            <div className="group relative h-12 sm:h-14 rounded-2xl bg-white/5 border border-white/10 focus-within:border-brand-purple/50 focus-within:bg-white/10 transition-all">
              <input
                type="password"
                value={resetData.confirmPassword}
                onChange={(e) => updateResetData("confirmPassword", e.target.value)}
                placeholder="Confirm New Password"
                className="hide-autofill h-full w-full rounded-2xl border-0 bg-inherit px-5 text-sm sm:text-base text-white ring-0 outline-0"
              />
              <MoveRight
                size={18}
                className="absolute top-1/2 right-5 -translate-y-1/2 transform text-white/20 group-focus-within:text-brand-purple transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <Button
              type="submit"
              disabled={resetData.loading}
              className="text-white bg-brand-purple hover:bg-brand-purple/90 h-12 sm:h-14 rounded-2xl text-base font-bold transition-all active:scale-[0.98] shadow-lg shadow-brand-purple/20"
            >
              {resetData.loading ? "Updating Security..." : "Confirm & Reset Password"}
            </Button>
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-white/40 hover:text-white transition-colors text-center"
            >
              Back to code entry
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
