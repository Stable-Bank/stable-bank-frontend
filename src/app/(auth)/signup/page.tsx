"use client";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/config/axios";
import { appRoutes } from "@/lib/navigation";
import { passwordSchema } from "@/schema/password";
import { MoveRight, Sparkles, User, Building2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [signupData, setSignupData] = useState({
    accountType: "individual",
    email: "",
    password: "",
    loading: false,
  });

  function updateSignupData<K extends keyof typeof signupData>(
    field: K,
    value: (typeof signupData)[K]
  ) {
    setSignupData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateSignupData("loading", true);

    if (!signupData.email || !signupData.password) {
      toast.error("Email and password are required.");
      updateSignupData("loading", false);
      return;
    }

    const validPassword = passwordSchema.safeParse(signupData.password);

    if (!validPassword.success) {
      toast.error(validPassword.error.issues.map((e) => e.message).join(" "));
      updateSignupData("loading", false);
      return;
    }

    try {
      await apiClient.post("/auth/register", {
        email: signupData.email,
        password: validPassword.data,
        accountType: signupData.accountType,
      });

      // Automatically send OTP after registration
      await apiClient.post("/auth/send-otp", { email: signupData.email });

      toast.success("Account created! Please verify your email.");
      router.push(`${appRoutes.auth.signUp}/../verify-otp?email=${encodeURIComponent(signupData.email)}`);
    } catch (error: any) {
      const errMsg = error?.message || "Signup failed. Please try again.";
      console.error("Signup error:", error);
      toast.error(errMsg);
    } finally {
      updateSignupData("loading", false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-5 sm:gap-6 md:gap-7 transition-all duration-500 relative">
      {step === 1 ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col gap-2 sm:gap-3 mb-8">
            <div className="flex w-fit items-center gap-2 sm:gap-3.5 rounded-full bg-[#0F0F0F] py-2 pr-8 sm:pr-12 md:pr-16 pl-2.5 text-sm sm:text-base font-medium shadow-2xl shadow-[#171E2E]">
              <Sparkles size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Choose Account Type</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
              How will you use{" "}
              <span className="text-brand-yellow">StableBank?</span>
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                updateSignupData("accountType", "individual");
                setStep(2);
              }}
              className="group relative flex items-center p-6 sm:p-8 rounded-[2rem] bg-[#0F0F0F] border border-white/5 hover:border-brand-purple/50 hover:bg-white/[0.02] transition-all duration-300 text-left overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mr-6 group-hover:bg-brand-purple/20 transition-all shrink-0">
                <User className="w-7 h-7 text-white/50 group-hover:text-brand-purple transition-colors" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Personal Account</h3>
                <p className="text-sm text-white/50">Your personal super-wallet for everyday stablecoin spending and yield.</p>
              </div>
              <MoveRight className="ml-auto w-6 h-6 text-white/20 group-hover:text-brand-purple transform group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => {
                updateSignupData("accountType", "business");
                setStep(2);
              }}
              className="group relative flex items-center p-6 sm:p-8 rounded-[2rem] bg-[#0F0F0F] border border-white/5 hover:border-brand-yellow/50 hover:bg-white/[0.02] transition-all duration-300 text-left overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mr-6 group-hover:bg-brand-yellow/20 transition-all shrink-0">
                <Building2 className="w-7 h-7 text-white/50 group-hover:text-brand-yellow transition-colors" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Business Account</h3>
                <p className="text-sm text-white/50">Manage global treasury, cross-border payroll, and team cards.</p>
              </div>
              <MoveRight className="ml-auto w-6 h-6 text-white/20 group-hover:text-brand-yellow transform group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <p className="flex justify-center mt-8 gap-2 text-sm sm:text-base">
            Already have an account?{" "}
            <Link
              href={appRoutes.auth.signIn}
              className="text-brand-purple font-bold"
            >
              Sign in
            </Link>
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSignup}
          className="flex w-full flex-col gap-5 sm:gap-6 md:gap-7 animate-in fade-in slide-in-from-right-4 duration-500"
        >
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center text-sm font-medium text-white/50 hover:text-white mb-2 transition-colors w-fit"
          >
            <ChevronLeft size={16} className="mr-1" /> Back to Account Type
          </button>

          <div className="flex flex-col gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
              Create your{" "}
              <span className={signupData.accountType === 'business' ? 'text-brand-yellow' : 'text-brand-purple'}>
                {signupData.accountType === 'business' ? 'Business' : 'Personal'} Account
              </span>
            </h1>
          </div>

          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
            <div className="relative h-[48px] sm:h-[52px] rounded-[8px] bg-[#0F0F0F] text-sm sm:text-base font-medium text-white placeholder:text-white/60">
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={(e) => updateSignupData("email", e.target.value)}
                placeholder="Email Address"
                className="hide-autofill h-full w-full rounded-[8px] border-0 bg-inherit px-3 sm:px-4 ring-0 outline-0"
              />
              <MoveRight
                size={20}
                className="absolute top-1/2 right-2 -translate-y-1/2 transform sm:w-6 sm:h-6"
                color="#FFFFFF52"
              />
            </div>
            <div className="relative h-[48px] sm:h-[52px] rounded-[8px] bg-[#0F0F0F] text-sm sm:text-base font-medium text-white placeholder:text-white/60">
              <input
                type="password"
                name="password"
                value={signupData.password}
                onChange={(e) => updateSignupData("password", e.target.value)}
                placeholder="Password"
                className="hide-autofill h-full w-full rounded-[8px] border-0 bg-inherit px-3 sm:px-4 ring-0 outline-0"
              />
              <MoveRight
                size={20}
                className="absolute top-1/2 right-2 -translate-y-1/2 transform sm:w-6 sm:h-6"
                color="#FFFFFF52"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Button
              type="submit"
              disabled={signupData.loading}
              className={`text-brand-white flex h-11 sm:h-12 cursor-pointer items-center justify-center rounded-[40px] px-6 sm:px-8 text-sm sm:text-base font-semibold transition-all ${
                signupData.accountType === 'business' ? 'bg-brand-yellow text-black hover:bg-brand-yellow/90' : 'bg-brand-purple hover:bg-brand-purple/90'
              }`}
            >
              {signupData.loading ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
