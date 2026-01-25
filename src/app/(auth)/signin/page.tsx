"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { appRoutes } from "@/lib/navigation";
import { MoveRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
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
          <span>Sign-in to your account</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Web3&apos;s Super-wallet,{" "}
          <span className="text-brand-yellow">Secure and Easy to use.</span>
        </h1>
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
            value={loginData.password}
            onChange={(e) => updateLoginData("password", e.target.value)}
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
          disabled={loginData.loading}
          className="text-brand-white bg-brand-purple flex h-11 sm:h-12 cursor-pointer items-center justify-center rounded-[40px] px-6 sm:px-8 text-sm sm:text-base font-semibold"
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
