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
        <div className="flex w-fit items-center gap-2 sm:gap-3.5 rounded-full bg-zinc-100 border border-zinc-200 py-1.5 pr-6 sm:pr-8 pl-3 text-xs sm:text-sm font-mono font-semibold text-zinc-800 shadow-sm">
          <KeyRound size={14} className="text-brand-purple" />
          <span>Reset Password</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-zinc-950">
          Don&apos;t worry, <span className="text-brand-purple">we&apos;ve got you covered.</span>
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base font-sans">
          Enter your email to receive a password reset code.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
        <div className="relative h-[48px] sm:h-[52px] rounded-xl bg-zinc-50 border border-zinc-200 text-sm sm:text-base font-medium text-zinc-900 placeholder:text-zinc-400 focus-within:border-brand-purple focus-within:bg-white transition-all shadow-xs">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="hide-autofill h-full w-full rounded-xl border-0 bg-transparent px-3 sm:px-4 ring-0 outline-0 text-zinc-900 placeholder:text-zinc-400 font-sans"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="text-white bg-brand-purple hover:bg-brand-purple/90 flex h-11 sm:h-12 cursor-pointer items-center justify-center rounded-full px-6 sm:px-8 text-sm sm:text-base font-bold shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? "Sending..." : "Send Reset Code"}
        </Button>

        <p className="flex justify-center gap-2 text-xs sm:text-sm text-zinc-600 font-sans">
          Remembered your password?{" "}
          <Link href={appRoutes.auth.signIn} className="text-brand-purple font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
