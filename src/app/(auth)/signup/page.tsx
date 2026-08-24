"use client";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/config/axios";
import { appRoutes } from "@/lib/navigation";
import { passwordSchema } from "@/schema/password";
import { MoveRight, User, Building2, ChevronLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
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
            <div className="flex w-fit items-center gap-2 sm:gap-2.5 rounded-full bg-white border border-zinc-200/90 py-1.5 px-3.5 text-xs sm:text-sm font-mono font-semibold text-zinc-800 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-brand-purple" />
              <span>Spend USDT Like Cash</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-zinc-950">
              Get started with{" "}
              <span className="text-brand-purple">StableBank.</span>
            </h1>
            <p className="text-zinc-600 text-sm sm:text-base font-sans">
              Choose how you want to spend and manage your stablecoins.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                updateSignupData("accountType", "individual");
                setStep(2);
              }}
              className="group relative flex items-center p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 hover:border-brand-purple/50 hover:shadow-md transition-all duration-300 text-left overflow-hidden shadow-sm cursor-pointer"
            >
              <div className="w-12 h-12 bg-brand-purple/10 rounded-xl flex items-center justify-center mr-5 group-hover:bg-brand-purple group-hover:text-white transition-all shrink-0 text-brand-purple">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-zinc-950 mb-1">Personal Account</h3>
                <p className="text-xs sm:text-sm text-zinc-600 font-sans">Spend your USDT & USDC like cash with instant virtual cards and high-yield vaults.</p>
              </div>
              <MoveRight className="ml-auto w-5 h-5 text-zinc-400 group-hover:text-brand-purple transform group-hover:translate-x-1 transition-all shrink-0" />
            </button>

            <button
              onClick={() => {
                updateSignupData("accountType", "business");
                setStep(2);
              }}
              className="group relative flex items-center p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 hover:border-brand-purple/50 hover:shadow-md transition-all duration-300 text-left overflow-hidden shadow-sm cursor-pointer"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mr-5 group-hover:bg-brand-purple group-hover:text-white transition-all shrink-0 text-brand-purple">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-zinc-950 mb-1">Business Account</h3>
                <p className="text-xs sm:text-sm text-zinc-600 font-sans">Corporate treasury, team expense cards, and global wire settlements in USD, GBP, & EUR.</p>
              </div>
              <MoveRight className="ml-auto w-5 h-5 text-zinc-400 group-hover:text-brand-purple transform group-hover:translate-x-1 transition-all shrink-0" />
            </button>
          </div>

          <p className="flex justify-center mt-8 gap-2 text-xs sm:text-sm text-zinc-600 font-sans">
            Already have an account?{" "}
            <Link
              href={appRoutes.auth.signIn}
              className="text-brand-purple font-bold hover:underline"
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
            className="flex items-center text-xs sm:text-sm font-mono font-medium text-zinc-500 hover:text-zinc-900 mb-2 transition-colors w-fit cursor-pointer"
          >
            <ChevronLeft size={16} className="mr-1" /> Back to Account Type
          </button>

          <div className="flex flex-col gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-zinc-950">
              Create your{" "}
              <span className="text-brand-purple">
                {signupData.accountType === 'business' ? 'Business' : 'Personal'} Account
              </span>
            </h1>
            <p className="text-zinc-600 text-sm sm:text-base font-sans">
              Instant setup with self-custodial security and zero hidden fees.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
            <div className="relative h-[48px] sm:h-[52px] rounded-xl bg-zinc-50 border border-zinc-200 text-sm sm:text-base font-medium text-zinc-900 placeholder:text-zinc-400 focus-within:border-brand-purple focus-within:bg-white transition-all shadow-xs">
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={(e) => updateSignupData("email", e.target.value)}
                placeholder="Email Address"
                className="hide-autofill h-full w-full rounded-xl border-0 bg-transparent px-3 sm:px-4 ring-0 outline-0 text-zinc-900 placeholder:text-zinc-400 font-sans"
              />
            </div>
            <div className="relative h-[48px] sm:h-[52px] rounded-xl bg-zinc-50 border border-zinc-200 text-sm sm:text-base font-medium text-zinc-900 placeholder:text-zinc-400 focus-within:border-brand-purple focus-within:bg-white transition-all shadow-xs">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={signupData.password}
                onChange={(e) => updateSignupData("password", e.target.value)}
                placeholder="Password"
                className="hide-autofill h-full w-full rounded-xl border-0 bg-transparent pl-3 pr-10 sm:pl-4 sm:pr-12 ring-0 outline-0 text-zinc-900 placeholder:text-zinc-400 font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer p-1 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} className="sm:w-5 sm:h-5" />
                ) : (
                  <Eye size={18} className="sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Button
              type="submit"
              disabled={signupData.loading}
              className="text-white flex h-11 sm:h-12 cursor-pointer items-center justify-center rounded-full px-6 sm:px-8 text-sm sm:text-base font-bold transition-all bg-brand-purple hover:bg-brand-purple/90 shadow-md shadow-brand-purple/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              {signupData.loading ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
