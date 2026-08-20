"use client";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/config/axios";
import { appRoutes } from "@/lib/navigation";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      await apiClient.post("/auth/forgot-password", { email });
      toast.success("Password reset OTP sent to your email.");
      router.push(`${appRoutes.auth.resetPassword}?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Failed to send reset OTP.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5 sm:gap-6 md:gap-7">
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="flex w-fit items-center gap-2 sm:gap-3.5 rounded-full bg-[#0F0F0F] py-2 pr-8 sm:pr-12 md:pr-16 pl-2.5 text-sm sm:text-base font-medium shadow-2xl shadow-[#171E2E]">
          <KeyRound size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span>Reset Password</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Don&apos;t worry, <span className="text-brand-purple">we&apos;ve got you covered.</span>
        </h1>
        <p className="text-white/60 text-sm sm:text-base">
          Enter your email to receive a password reset code.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
        <div className="relative h-[48px] sm:h-[52px] rounded-[8px] bg-[#0F0F0F] text-sm sm:text-base font-medium text-white placeholder:text-white/60">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="hide-autofill h-full w-full rounded-[8px] border-0 bg-inherit px-3 sm:px-4 ring-0 outline-0"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="text-brand-white bg-brand-purple flex h-11 sm:h-12 cursor-pointer items-center justify-center rounded-[40px] px-6 sm:px-8 text-sm sm:text-base font-semibold"
        >
          {loading ? "Sending..." : "Send Reset Code"}
        </Button>

        <p className="flex justify-center gap-2 text-sm sm:text-base">
          Remembered your password?{" "}
          <Link href={appRoutes.auth.signIn} className="text-brand-purple font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
