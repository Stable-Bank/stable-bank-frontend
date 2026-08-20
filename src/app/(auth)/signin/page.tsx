"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { appRoutes } from "@/lib/navigation";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    loading: false,
  });

  function updateLoginData<K extends keyof typeof loginData>(
    field: K,
    value: (typeof loginData)[K]
  ) {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateLoginData("loading", true);

    if (!loginData.email || !loginData.password) {
      toast.error("Email and password are required.");
      updateLoginData("loading", false);
      return;
    }

    try {
      await login(loginData.email, loginData.password);
      router.push(appRoutes.dashboard.home);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      updateLoginData("loading", false);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="flex w-full flex-col gap-5 sm:gap-6 md:gap-7"
    >
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="flex w-fit items-center gap-2 sm:gap-3.5 rounded-full bg-[#0F0F0F] py-2 pr-8 sm:pr-12 md:pr-16 pl-2.5 text-sm sm:text-base font-medium shadow-2xl shadow-[#171E2E]">
          <Sparkles size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span>Spend USDT Like Cash</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Welcome back to{" "}
          <span className="text-brand-yellow">StableBank.</span>
        </h1>
        <p className="text-white/60 text-sm sm:text-base">
          Sign in to manage your virtual cards, fiat accounts, and stablecoin balances.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
        <div className="relative h-[48px] sm:h-[52px] rounded-[8px] bg-[#0F0F0F] text-sm sm:text-base font-medium text-white placeholder:text-white/60">
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={(e) => updateLoginData("email", e.target.value)}
            placeholder="Email Address"
            className="hide-autofill h-full w-full rounded-[8px] border-0 bg-inherit px-3 sm:px-4 ring-0 outline-0"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative h-[48px] sm:h-[52px] rounded-[8px] bg-[#0F0F0F] text-sm sm:text-base font-medium text-white placeholder:text-white/60">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={loginData.password}
              onChange={(e) => updateLoginData("password", e.target.value)}
              placeholder="Password"
              className="hide-autofill h-full w-full rounded-[8px] border-0 bg-inherit pl-3 pr-10 sm:pl-4 sm:pr-12 ring-0 outline-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer p-1 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={18} className="sm:w-5 sm:h-5" />
              ) : (
                <Eye size={18} className="sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
          <div className="flex justify-end">
            <Link
              href={appRoutes.auth.forgotPassword}
              className="text-sm sm:text-sm text-white/50 hover:text-brand-purple transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          disabled={loginData.loading}
          className="text-brand-white bg-brand-purple flex h-11 sm:h-12 cursor-pointer items-center justify-center rounded-[40px] px-6 sm:px-8 text-sm sm:text-base font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
        >
          {loginData.loading ? "Signing in..." : "Sign-in"}
        </Button>
        <p className="flex justify-end gap-2 text-sm sm:text-base">
          Don&apos;t have an account?{" "}
          <Link
            href={appRoutes.auth.signUp}
            className="text-brand-purple font-bold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
