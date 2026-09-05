"use client";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/config/axios";
import { appRoutes } from "@/lib/navigation";
import { passwordSchema } from "@/schema/password";
import { LockKeyhole, Eye, EyeOff, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { OtpInput } from "@/components/ui/otp-input";
import { cn } from "@/lib/utils";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryEmail = searchParams.get("email") || "";

  const [step, setStep] = useState(1); // 1: OTP, 2: New Password
  const [email, setEmail] = useState(queryEmail);
  const [emailInput, setEmailInput] = useState(queryEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(!queryEmail);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetData, setResetData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
    loading: false,
  });

  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (queryEmail) {
      setEmail(queryEmail);
      setEmailInput(queryEmail);
      setIsEditingEmail(false);
    }
  }, [queryEmail]);

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
    const targetEmail = email || emailInput;
    if (!targetEmail) {
      toast.error("Please enter your email address first.");
      setIsEditingEmail(true);
      return;
    }
    if (resendTimer > 0) return;

    try {
      await apiClient.post("/auth/forgot-password", { email: targetEmail });
      setEmail(targetEmail);
      setIsEditingEmail(false);
      toast.success("Security code resent to your email.");
      setResendTimer(60);
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Failed to resend code.";
      toast.error(errMsg);
    }
  };

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setEmail(emailInput);
    setIsEditingEmail(false);
    handleResendCode();
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = email || emailInput;
    if (!targetEmail) {
      toast.error("Please enter your email address.");
      setIsEditingEmail(true);
      return;
    }

    if (resetData.otp.length !== 6) {
      toast.error("Please enter the complete 6-digit security code.");
      return;
    }

    updateResetData("loading", true);
    try {
      await apiClient.post("/auth/verify-reset-code", {
        email: targetEmail,
        otp: resetData.otp,
      });
      setEmail(targetEmail);
      setStep(2);
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Invalid or expired security code.";
      toast.error(errMsg);
    } finally {
      updateResetData("loading", false);
    }
  };

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const targetEmail = email || emailInput;

    if (!targetEmail) {
      toast.error("Email is missing. Please go back to step 1.");
      setStep(1);
      return;
    }
    
    if (resetData.password !== resetData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const validPassword = passwordSchema.safeParse(resetData.password);
    if (!validPassword.success) {
      toast.error(validPassword.error.issues.map((err) => err.message).join(" "));
      return;
    }

    updateResetData("loading", true);

    try {
      await apiClient.post("/auth/reset-password", {
        email: targetEmail,
        otp: resetData.otp,
        password: validPassword.data,
      });

      toast.success("Password reset successfully! Please sign in.");
      router.push(appRoutes.auth.signIn);
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Reset failed. Please try again.";
      toast.error(errMsg);
      if (errMsg.toLowerCase().includes("otp") || errMsg.toLowerCase().includes("code")) {
        setStep(1);
      }
    } finally {
      updateResetData("loading", false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-5 sm:gap-6">
      {/* Header Badge & Title */}
      <div className="flex flex-col gap-2.5 sm:gap-3 text-left">
        <div className="flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100/90 px-3.5 py-1.5 font-mono text-xs font-semibold text-zinc-800 uppercase tracking-wider shadow-xs">
          <LockKeyhole size={14} className="text-brand-purple" />
          <span>{step === 1 ? "Identity Verification" : "Security Setup"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-zinc-950 tracking-tight">
          {step === 1 ? (
            <>Check your <span className="text-brand-purple">inbox.</span></>
          ) : (
            <>Secure your <span className="text-brand-purple">account.</span></>
          )}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base font-sans">
          {step === 1
            ? "Enter the 6-digit security code sent to your registered email."
            : "Create a new strong password to protect your account and funds."}
        </p>
      </div>

      {/* Main Elevated Form Card */}
      <div className="w-full rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 p-5 sm:p-7 md:p-8 shadow-sm">
        {step === 1 ? (
          <form onSubmit={handleNextStep} className="flex flex-col gap-5 sm:gap-6">
            {/* Target Email Banner or Input */}
            {isEditingEmail ? (
              <div className="flex flex-col gap-2 rounded-xl bg-zinc-50 border border-zinc-200 p-3 sm:p-3.5">
                <label className="text-xs font-semibold text-zinc-600">Account Email</label>
                <div className="flex gap-2">
                  <div className="relative flex-1 h-10 sm:h-11 rounded-lg bg-white border border-zinc-200 focus-within:border-brand-purple transition-all">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="name@example.com"
                      className="h-full w-full bg-transparent px-3 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none font-sans"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleUpdateEmail}
                    className="h-10 sm:h-11 px-4 text-xs sm:text-sm font-semibold bg-brand-purple hover:bg-brand-purple/90 text-white rounded-lg cursor-pointer"
                  >
                    Send Code
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-50 border border-zinc-200/90 px-3.5 py-2.5 text-xs sm:text-sm">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Mail size={16} className="text-brand-purple shrink-0" />
                  <span className="truncate font-medium text-zinc-700">
                    Code sent to <strong className="text-zinc-950 font-semibold font-mono">{email}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingEmail(true)}
                  className="text-brand-purple hover:text-brand-purple/80 font-bold shrink-0 text-xs hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>
            )}

            {/* OTP Input Container */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-zinc-50/70 border border-zinc-200/80 p-4 sm:p-6">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Security Code
              </span>
              <div className="w-full flex justify-center py-2">
                <OtpInput 
                  value={resetData.otp} 
                  onChange={(val) => updateResetData("otp", val)} 
                  disabled={resetData.loading}
                />
              </div>

              {/* Resend Link */}
              <div className="flex items-center justify-center gap-1.5 pt-3 text-xs sm:text-sm font-sans">
                <span className="text-zinc-500">Didn&apos;t receive it?</span>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendTimer > 0 || resetData.loading}
                  className={cn(
                    "font-bold transition-colors cursor-pointer",
                    resendTimer > 0
                      ? "text-zinc-400 cursor-not-allowed"
                      : "text-brand-purple hover:text-brand-purple/80 underline underline-offset-4"
                  )}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col gap-3 pt-1">
              <Button
                type="submit"
                disabled={resetData.otp.length !== 6 || resetData.loading}
                className="w-full text-white bg-brand-purple hover:bg-brand-purple/90 h-11 sm:h-12 rounded-full text-sm sm:text-base font-bold transition-all active:scale-[0.98] shadow-md shadow-brand-purple/20 cursor-pointer"
              >
                {resetData.loading ? "Verifying Code..." : "Continue to Password"}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-zinc-500 font-sans">
                <Link
                  href={appRoutes.auth.forgotPassword}
                  className="inline-flex items-center gap-1 text-zinc-600 hover:text-zinc-950 transition-colors"
                >
                  <ArrowLeft size={13} />
                  <span>Back to forgot password</span>
                </Link>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-5 sm:gap-6">
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200/80 px-3.5 py-2.5 text-xs sm:text-sm text-emerald-800">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Identity verified. Please set your new secure password.</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">New Password</label>
                <div className="relative h-11 sm:h-12 rounded-xl bg-zinc-50 border border-zinc-200 focus-within:border-brand-purple focus-within:bg-white transition-all shadow-xs">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoFocus
                    value={resetData.password}
                    onChange={(e) => updateResetData("password", e.target.value)}
                    placeholder="Enter new password"
                    className="hide-autofill h-full w-full rounded-xl border-0 bg-transparent pl-4 pr-11 text-sm sm:text-base text-zinc-950 placeholder:text-zinc-400 outline-0 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">Confirm New Password</label>
                <div className="relative h-11 sm:h-12 rounded-xl bg-zinc-50 border border-zinc-200 focus-within:border-brand-purple focus-within:bg-white transition-all shadow-xs">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={resetData.confirmPassword}
                    onChange={(e) => updateResetData("confirmPassword", e.target.value)}
                    placeholder="Confirm new password"
                    className="hide-autofill h-full w-full rounded-xl border-0 bg-transparent pl-4 pr-11 text-sm sm:text-base text-zinc-950 placeholder:text-zinc-400 outline-0 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer p-1"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                disabled={resetData.loading}
                className="w-full text-white bg-brand-purple hover:bg-brand-purple/90 h-11 sm:h-12 rounded-full text-sm sm:text-base font-bold transition-all active:scale-[0.98] shadow-md shadow-brand-purple/20 cursor-pointer"
              >
                {resetData.loading ? "Updating Password..." : "Confirm & Reset Password"}
              </Button>
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="text-xs sm:text-sm text-zinc-500 hover:text-zinc-950 transition-colors text-center cursor-pointer font-sans"
              >
                Back to code verification
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
