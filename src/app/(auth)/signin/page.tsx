"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { appRoutes } from "@/lib/navigation";
import { Eye, EyeOff } from "lucide-react";
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

  const updateLoginData = (key: string, value: string | boolean) => {
    setLoginData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      updateLoginData("loading", true);
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
        <div className="flex w-fit items-center gap-2 sm:gap-2.5 rounded-full bg-white border border-zinc-200/90 py-1.5 px-3.5 text-xs sm:text-sm font-mono font-semibold text-zinc-800 shadow-xs">
          <span className="h-2 w-2 rounded-full bg-brand-purple" />
          <span>Spend USDT Like Cash</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-zinc-950">
          Welcome back to{" "}
          <span className="text-brand-purple">StableBank.</span>
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base font-sans">
          Sign in to manage your virtual cards, fiat accounts, and stablecoin balances.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
        <div className="relative h-[48px] sm:h-[52px] rounded-xl bg-zinc-50 border border-zinc-200 text-sm sm:text-base font-medium text-zinc-900 placeholder:text-zinc-400 focus-within:border-brand-purple focus-within:bg-white transition-all shadow-xs">
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={(e) => updateLoginData("email", e.target.value)}
            placeholder="Email Address"
            className="hide-autofill h-full w-full rounded-xl border-0 bg-transparent px-3 sm:px-4 ring-0 outline-0 text-zinc-900 placeholder:text-zinc-400 font-sans"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative h-[48px] sm:h-[52px] rounded-xl bg-zinc-50 border border-zinc-200 text-sm sm:text-base font-medium text-zinc-900 placeholder:text-zinc-400 focus-within:border-brand-purple focus-within:bg-white transition-all shadow-xs">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={loginData.password}
              onChange={(e) => updateLoginData("password", e.target.value)}
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
          <div className="flex justify-end">
            <Link
              href={appRoutes.auth.forgotPassword}
              className="text-xs sm:text-sm text-zinc-500 hover:text-brand-purple transition-colors font-sans"
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
          className="text-white bg-brand-purple hover:bg-brand-purple/90 flex h-11 sm:h-12 cursor-pointer items-center justify-center rounded-full px-6 sm:px-8 text-sm sm:text-base font-bold shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {loginData.loading ? "Signing in..." : "Sign-in"}
        </Button>
        <p className="flex justify-end gap-2 text-xs sm:text-sm text-zinc-600 font-sans">
          Don&apos;t have an account?{" "}
          <Link
            href={appRoutes.auth.signUp}
            className="text-brand-purple font-bold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
